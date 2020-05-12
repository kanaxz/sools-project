const Query = require("../virtuals/Query")
const RootPath = require("../virtuals/RootPath")
const utils = require("../utils")
const Handler = require("./Handler");
const Virtuals = require("sools/data/virtualizing/Virtual/enum")
const Unhandleable = require("sools/executing/Unhandleable")
const Cursor = require("../virtuals/Cursor")

module.exports = class QueryHandler extends Handler {
	async processFunctionCall(scope, functionCall){
		if([Virtuals.query,Virtuals.array].indexOf(functionCall.function.type) == -1)
			return
		var arg = await scope.getValue(functionCall.args[0],Query)
		if(arg instanceof Query){
			var query = arg;
			var	cursor = new Cursor(query.collection,query.collection.mongo.aggregate(query.pipeline))
			scope.replaceValue(functionCall.args[0],cursor);
			return await this[functionCall.function.name](scope,functionCall,cursor);
		}
	}

	async forEach(scope,functionCall,cursor){	

		while(await cursor.mongo.hasNext()){

			var model = await cursor.mongo.next()
			var child = scope.child();
			child.setValue(functionCall.args[1].source.scope.args[0],model);
			await child.process(functionCall.args[1].source.scope);
		}
		return cursor;
	}
}