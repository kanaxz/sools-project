const Worker = require("../../../virtualizing/Worker")
const Virtuals = require("../Virtual/enum")
const Sources = require("../../../virtualizing/Source/enum")
const Functions = require("../../../virtualizing/functions")

const Array = require("../../../virtualizing/Virtual/enum/Array")
const HandlerOptions = require("../../../virtualizing/Handler/Options")
const Function = require("../../../virtualizing/Virtual/enum/Function")
const DynamicFunction = require("../../../virtualizing/Source/enum/DynamicFunction")
const FunctionCall = require("../../../virtualizing/Source/enum/FunctionCall")

module.exports = class Load extends Worker{

	onFunctionCalled(scope, functionCall){
		if([Virtuals.model.methods.load,Virtuals.hasMany.methods.load].indexOf(functionCall.function) != -1){
			var type = functionCall.args[0];
			if(type.typeName == "hasMany")
				type = type.type;
			functionCall.args[1] = new Function(new HandlerOptions({
				scope:functionCall.scope,
				source:new DynamicFunction({
					scope:functionCall.scope,
					args:[new Array(new HandlerOptions({
						type
					}))._handler],
					fn:(models, $)=>{
						var scope = $._private;
						models = functionCall.args[0].property.load(functionCall.args[0].source.source.virtual,models);
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
						else{
							return models;
						}
					}
				})
			}))._handler
		}
	}
}