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
const utils = require("../../../virtualizing/utils")

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
		if(functionCall.function == Virtuals.collection.methods.push){
			let oldFunctionCall = functionCall
			if(checkFlag(scope))
				return;
			let control = this.controls[oldFunctionCall.args[0].template.typeName]
			if(!control.add)
				return
			let index = scope.statements.indexOf(oldFunctionCall)
			let newFunctionCall;
			let save = oldFunctionCall.args[1]
			new DynamicFunction({
				scope,
				args:[oldFunctionCall.args[1]],
				fn:(models,$)=>{
					let subScope = $._private
					subScope[flag] = true
					let result = control.add($.context,models,$)
					subScope[flag] = false
					return result;
				}
			}).call(scope,[save.virtual],(functionCall)=>{
				newFunctionCall = functionCall
				scope.statements[index] = newFunctionCall;
			})
			return new (Array.of(newFunctionCall.args[0].template))(new HandlerOptions({
				source:newFunctionCall
			}))
		}
		else if(functionCall.function == Virtuals.collection.methods.get){
			var control = this.controls[functionCall.args[0].template.typeName]
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
			
			var type = functionCall.args[0].constructor.virtual;
			if(type.prototype instanceof Virtuals.hasMany)
				type = type.template;
			if(!this.controls[type.typeName])
				return
			
			var control = this.controls[type.typeName].get
			if(!control)
				return
			functionCall.args[1] = new Function(new HandlerOptions({
				source:new DynamicFunction({
					scope:functionCall.scope,
					args:[new (Array.of(type))(new HandlerOptions({
						source:utils.gererateVariableId()
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
