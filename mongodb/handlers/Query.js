const Query = require("../virtuals/Query")
const RootPath = require("../virtuals/RootPath")
const utils = require("../utils")
const Handler = require("./Handler");
const Virtuals = require("sools/modeling/virtualizing/Virtual/enum")
const Unhandleable = require("sools/executing/Unhandleable")
const updateFlag = Symbol('updateFunction')
const deleteFlag = Symbol('deleteFlag')

module.exports = class QueryHandler extends Handler {
	async processFunctionCall(scope, functionCall){
		if(functionCall.function[updateFlag]){
			var details = functionCall.function[updateFlag];
			await details.collection.mongo.updateOne({
				_id:details.model._id
			},{
				$set:details.model
			})
			return null
		}
		if(functionCall.function[deleteFlag]){
			var details = functionCall.function[deleteFlag];
			await details.collection.mongo.deleteOne({
				_id:details.model._id
			})
			return null
		}
		if([Virtuals.query,Virtuals.array].indexOf(functionCall.function.type) == -1)
			return
		var arg = await scope.getValue(functionCall.args[0],Query)
		if(arg instanceof Query){
			try{
				var query = arg;
				var functionName = functionCall.function.name
				if(['filter','map','forEach'].indexOf(functionName) != -1){
					if(functionName != "forEach")
						query = query.clone();

					var child = utils.childScope(scope, query);
					child.setValue(functionCall.args[1].source.scope.args[0],new RootPath("$$CURRENT","$$CURRENT",query));
					var result = await child.process(functionCall.args[1].source.scope)
					return await this[functionName](query,result);
				}
				else{
					if(!this[functionName])
						return;
					return await this[functionName](scope,query,functionCall);	
				}
			}
			catch(e){
				if(e instanceof Unhandleable)
					return
				else
					throw e;
			}
		}
	}
	/*
	async update(scope,query,functionCall){
		var models = await query.getValue(null);
		for(var model of models){
			var child = scope.child()
			functionCall.args[1].source.scope.args[1].source[updateFlag] = {
				model,
				collection:query.collection
			}
			child.setValue(functionCall.args[1].source.scope.args[0],model);
			await child.process(functionCall.args[1].source.scope);
		}
		return models
	}


	async delete(scope,query,functionCall){
		var models = await query.getValue(null);
		if(functionCall.args[1] == null){
			await query.collection.mongo.deleteMany({
				_id:{
					$in:models.map((m)=>m._id)
				}
			})
		}
		else{
			
			for(var model of models){
				var child = scope.child()
				debugger
				functionCall.args[1].source.scope.args[1].source[deleteFlag] = {
					model,
					collection:query.collection
				}
				child.setValue(functionCall.args[1].source.scope.args[0],model);
				await child.process(functionCall.args[1].source.scope);
			}
		}
		return models
	}
	/**/
	async forEach(mongoQuery,result){	
		return mongoQuery
	}

	async filter(mongoQuery,result){		
		mongoQuery.pipeline.push({
			$match:{
				$expr:result
			}
		})
		return mongoQuery
	}

	async map(mongoQuery,result){
		if(typeof(result) != "object"){
			if(result == "$$CURRENT")
				return mongoQuery
			else
				throw new Error();
		}

		mongoQuery.pipeline.push({
			$project:{
				...result,
				_id:0
			}
		})
		return mongoQuery
	}
}