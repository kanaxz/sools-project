const Query = require("../virtuals/Query")
const RootPath = require("../virtuals/RootPath")
const utils = require("../utils")
const Handler = require("./Handler");
const Virtuals = require("sools/data/virtualizing/Virtual/enum")
const Unhandleable = require("sools/executing/Unhandleable")
const mongo = require("mongodb");
const VCollection = require("../virtuals/Collection")
module.exports = class Collection extends Handler {
	async processFunctionCall(scope, functionCall){
		if(functionCall.function.type == Virtuals.collection){
			return await this[functionCall.function.name](scope,functionCall)
		}
	}

	async get(scope, functionCall){
		var collection = await scope.getValue(functionCall.args[0],VCollection);
		return new Query(collection);
	}

	async update(scope, functionCall){
		var collection = await scope.getValue(functionCall.args[0],VCollection);
		var query = new Query(collection);
		var child = utils.childScope(scope,query)
		child.setValue(functionCall.args[1].source.scope.args[0],query);
		query = await child.process(functionCall.args[1].source.scope);
		debugger
		var models = await query.getValue(null);
		for(var model of models){
			child = scope.child();
			child.setValue(functionCall.args[2].source.scope.args[0],model);
			await child.process(functionCall.args[2].source.scope)
			await collection.mongo.updateOne({
				_id:model._id
			},{
				$set:model
			})
		}
		return models;
	}

	async push(scope ,functionCall){
		var collection = await scope.getValue(functionCall.args[0],VCollection);
		var models = await scope.getValue(functionCall.args[1]);
		var properties = functionCall.args[0].template.properties;
		models = await collection.insertMany(models.map((model)=>{
			var result = {};
			for(var p in model){
				var property = properties[p];
				var value = model[p]
				if((property.type.prototype instanceof Virtuals.model)){
					value = {
						_id:new mongo.ObjectId(value._id)
					}
				}
				else if(property.type.prototype instanceof Virtuals.hasMany){
					continue
				}
				else{
					if(p == "_id")
						value = new mongo.ObjectId(model[p])
				}
				result[p] = value
			}
			return result
		}));
		return models
	}
}