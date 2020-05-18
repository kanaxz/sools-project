const utils = require("../utils")
const RootPath = require("../virtuals/RootPath")
const Path = require("../virtuals/Path")
const Virtuals = require("sools/data/virtualizing/Virtual/enum")
const MongoScope = require("../Scope")
const Handler = require("./Handler");
async function arrayFunctionCallWrapper(scope, functionCall, fn){
	var root = await utils.getRoot(scope, functionCall.args[0]);
	var split = root.path.split(".")
	split.shift();
	var path = split.join(".");
	root.query.pipeline.push({
		$unwind:{
			path:"$" + path
		}
	})
	var length = root.query.pipeline.length;
	var child = utils.childScope(scope);

	var object = functionCall.args[1].source.scope.args[0];
	child.setValue(object,new RootPath("$$" + object.source.name,root.path, root.query))
	var result = await fn(child)
	if(root.query.pipeline.length == length){
		root.query.pipeline.splice(root.query.pipeline.length - 1, 1)
		return result
	}

	var group = {
		_id:'$_id'
	};
	for(var propertyName in root.handler.constructor.virtual.properties){
		group[propertyName] = {
			$first:'$' + propertyName
		}
	}
	group[path] = {
		$push: "$" + path
	}
	root.query.pipeline.push({
		$group:group
	});
	return result
}


module.exports = class Array extends Handler{
	async processFunctionCall(scope, functionCall){
		if(functionCall.function.type != Virtuals.array)
			return
		if(!(scope instanceof MongoScope))
			return
		var source = await scope.getValue(functionCall.args[0])
		if(!source){
			debugger
			throw new Error()
		}
		if(source instanceof Path){
			if(['find','map','filter'].indexOf(functionCall.function.name) != -1){
				var object = functionCall.args[1].source.scope.args[0]
				return await arrayFunctionCallWrapper(scope,functionCall,async (child)=>{
					return await this[functionCall.function.name](child, source.value, functionCall)	
				})	
			}
			else{
				return await this[functionCall.function.name](scope, source.value, functionCall)	
			}
		}
		else{
			var object = functionCall.args[1].source.scope.args[0]
			var child = utils.childScope(scope);
			child.setValue(object, new Path("$$" + object.source.name))
			var memoryArrayId = utils.gererateVariableId();
			if(source.toJSON)
				source = source.toJSON();
			return {
				$let:{
					vars:{
						[memoryArrayId]:source
					},
					in:await this[functionCall.function.name](child, "$$" + memoryArrayId, functionCall)
				}
			}
		}

	}

	async length(scope, source, functionCall){						
		return {
			$size:source
		}
	}

	async find(scope, source, functionCall){		
		return {
			$arrayElemAt:[{
				$filter:{
					input:source,
					as:functionCall.args[1].source.scope.args[0].source.name,
					cond:await scope.process(functionCall.args[1].source.scope)
				}
			},0]
		}
	}
	
	async map(scope , source, functionCall){
		return {
			$map:{
				input:source,
				as:functionCall.args[1].source.scope.args[0].source.name,
				in:await buildExpr(scope,functionCall.args[1])
			}
		}
	}
}