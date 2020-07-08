const Handler = require("sools/executing/Handler");
const Collections = require("sools/data/virtualizing/Virtual/enum")

module.exports= class Ignore extends Handler{
	processFunctionCall(scope,functionCall,next){
		var type = await scope.getValue(functionCall.scope.getVar('type'));
		var models = functionCall.scope.getVar('models')
		if(functionCall.function.type == Virtuals.collection 
			&& functionCall.function.name == type
			&& functionCall.args[0].template.prototype instanceof models.template){
			
		}
		if([Virtuals.collection].indexOf(functionCall.function.type) != -1){
			return null
		}
	}
}