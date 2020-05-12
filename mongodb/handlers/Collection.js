const Query = require("../virtuals/Query")
const RootPath = require("../virtuals/RootPath")
const utils = require("../utils")
const Handler = require("./Handler");
const Virtuals = require("sools/data/virtualizing/Virtual/enum")
const Unhandleable = require("sools/executing/Unhandleable")

module.exports = class Collection extends Handler {
	async processFunctionCall(scope, functionCall){
		if(functionCall.function.type == Virtuals.collection){
			return await this[functionCall.function.name](scope,functionCall)
		}
	}

	async get(scope, functionCall){
		var collection = await scope.getValue(functionCall.args[0]);
		return new Query(collection);
	}

	async push(scope ,functionCall){
		var collection = await scope.getValue(functionCall.args[0]);
		var models = await scope.getValue(functionCall.args[1]);
		await collection.insertMany(models);
		return null
	}
}