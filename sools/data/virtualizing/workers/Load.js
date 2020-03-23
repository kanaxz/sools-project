const Worker = require("../../../virtualizing/Worker")
const Virtuals = require("../Virtual/enum")
const Sources = require("../../../virtualizing/Source/enum")
const Statement = require("../../../virtualizing/Statement")
const Functions = require("../../../virtualizing/functions")
const Function = require("../../../virtualizing/Virtual/enum/Function")
const Array = require("../../../virtualizing/Virtual/enum/Array")
const HandlerOptions = require("../../../virtualizing/Handler/Options")


module.exports = class Load extends Worker{
	onFunctionCalled(scope,functionCall){
		if(functionCall.function.source.name == "load"){
			var type;
			var handler = functionCall.args[0];
			if(handler instanceof Virtuals.hasMany.handler){
				type = handler.type;
			}
			else{
				type = handler;
			}
			var save = functionCall.args[1]
			functionCall.args[1] = new Function(scope,[new Array(new HandlerOptions({
				type
			}))._handler],(models,$)=>{
				models = handler.property.load(handler.source.source.virtual, models)
				if(save){
					//remove return statment
					$._private.statements.splice(-1,1)
					Functions.return.call($._private,[new Array(new HandlerOptions({
						source:new Sources.functionCall({
							scope:$._private,
							function:save,
							args:[models]
						}),
						type
					}))])
					/*
					$._private.statements.push(new Statement(new Sources.functionCall({
						scope:$._private,
						function:new Function(new HandlerOptions({
							scope:$._private,
							source:Functions.return
						})),
						args:[new Array(new HandlerOptions({
							source:new Sources.functionCall({
								scope:$._private,
								function:save,
								args:[models]
							}),
							type
						}))]
					})));
					/**/
				}
				else
					return models
			})._handler
		}
	}
}