var path = "../../../virtualizing";
const Worker = require(path + "/Worker")
const HandlerOptions = require(path + "/Handler/Options")
const flag = Symbol('controlFlag');
const Reference = require(path+"/Handler/Reference")
const Virtuals = require("../Virtual/enum")
const Function = require("../../../virtualizing/Virtual/enum/Function")
const DynamicFunction = require("../../../virtualizing/Source/enum/DynamicFunction")
const Array = require("../../../virtualizing/Virtual/enum/Array")
const FunctionCall = require("../../../virtualizing/Source/enum/FunctionCall")
const Functions = require("../../../virtualizing/functions")

function checkFlag(scope){
	if(typeof(scope[flag]) == "boolean")
		return scope[flag]
	else if(scope.parent)
		return checkFlag(scope.parent);
	else 
		return false;
}

module.exports = class Controller extends Worker{
	constructor(controls){
		super();
		this.controls = controls;
	}

	onFunctionCalled(scope, functionCall, result){

		if(functionCall.function == Virtuals.collection.methods.get){
			var control = this.controls[functionCall.args[0].model.typeName]
			if(control && control.get){
				if(checkFlag(scope))
					return

				scope[flag] = true;
				var context = scope.$.context;
				result = control.get(context, result,(models)=>models,scope.$);
				result.forEach((model)=>{
					model.unload({})
				})
				scope[flag] = false;
				return result;
			}
		
		}
		else if([Virtuals.model.methods.load,Virtuals.hasMany.methods.load].indexOf(functionCall.function) != -1){
			var fn = functionCall.function;
			if(checkFlag(scope))
				return
			
			var type = functionCall.args[0];
			if(type.typeName == "hasMany")
				type = type.type;
			if(!this.controls[type.typeName])
				return
			
			var control = this.controls[type.typeName].get
			if(!control)
				return

			functionCall.args[1] = new Function(new HandlerOptions({
				source:new DynamicFunction({
					scope:functionCall.scope,
					args:[new Array(new HandlerOptions({
						type
					}))._handler],
					fn:(models, $)=>{
						var scope = $._private;
						scope[flag] = true;
						return control($.context,models,(models)=>{
							models.forEach((model)=>{
								model.unload({})
							})
							if(functionCall.args[1]){
								scope.processArg(models)
								scope.statements.push(new FunctionCall({
									function:Functions.return,
									args:[models._handler.clone({
										scope,
										source:new FunctionCall({
											args:[models],
											function:functionCall.args[1].source
										})
									})]
								}))
							}
							else
								return models;
						})
					}
				})
			}))._handler
		}
		/**/
	}
}