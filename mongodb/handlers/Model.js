const Query = require("../virtuals/Query")
const RootPath = require("../virtuals/RootPath")
const utils = require("../utils")
const Virtuals = require("sools/modeling/virtualizing/Virtual/enum")
const Path = require("../virtuals/Path")
const Expression = require("../virtuals/Expression")
const Handler = require("./Handler");
const mongo = require('mongodb');
const Unhandleable = require("sools/executing/Unhandleable")
const MongoScope = require("../Scope")
const Collection = require("../virtuals/Collection")

var envs = {
	memory:{
		async eq(scope, functionCall){
			var model1 = await scope.getValue(functionCall.args[0])
			var model2 = await scope.getValue(functionCall.args[1])		
			debugger
			if(model2 == null)
				return model1 == null
			return model1._id == model2._id
		}
	},
	mongo:{
		async eq(scope, functionCall){
			var result = [];
			for(var arg of functionCall.args){
				var model = await scope.getValue(arg,Path);
				var id;
				if(model instanceof Path)
					id = [model.value,"_id"].join(".")
				else
					id = new mongo.ObjectId(model._id)
				result.push(id)
			}
			return new Expression({
				$eq:result
			})
		}
	}
}

module.exports = class Model extends Handler {
	async processFunctionCall(scope, functionCall){
		if(functionCall.function == Virtuals.virtual.methods.eq){
			if(!(functionCall.args[0].virtual instanceof Virtuals.model)){
				return
			}
		}
		else if(functionCall.function.type != Virtuals.model)
			return

		var env = scope instanceof MongoScope ? "mongo":"memory";
		return await envs[env][functionCall.function.name](scope,functionCall)
	}

	async update(scope, functionCall){
		if(scope instanceof MongoScope)
			throw new Unhandleable()
		var model = await scope.getValue(functionCall.args[0])
		var collection = new Collection(functionCall.args[0].typeName + "s",this.source);
		await collection.mongo.updateOne({
			_id:model._id
		},{
			$set:model
		})
		return null
	}

	async delete(scope, functionCall){
		if(scope instanceof MongoScope)
			throw new Unhandleable()
		var model = await scope.getValue(functionCall.args[0])
		var collection = new Collection(functionCall.args[0].typeName + "s",this.source);
		await collection.mongo.deleteOne({
			_id:model._id
		})
		return null
	}

	
}