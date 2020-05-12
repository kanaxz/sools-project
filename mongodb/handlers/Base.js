const Virtuals = require("sools/data/virtualizing/Virtual/enum")
const Path = require("../virtuals/Path")
const Expression = require("../virtuals/Expression")
const Handler = require("./Handler");
const mongo = require("mongodb")
module.exports = class Base extends Handler {
	async processFunctionCall(scope, functionCall){
		if(functionCall.function.type == Virtuals.base){
			var result = [];
			var isId = false;
			for(var arg of functionCall.args){
				var value = await scope.getValue(arg,Path)
				if(arg.source.path == "_id"){
					isId = true;
				}
				result.push(value)
			}
			result = result.map((value)=>{
				if(value instanceof Path)
					return value.value
				return isId ? new mongo.ObjectId(value) : value
			})
			//console.log(result)
			return new Expression({
				["$" + functionCall.function.name] : result
			})
		}
	}
}