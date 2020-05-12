const Handler = require("../Handler");
const Functions = require("../../virtualizing/functions")
const Sources = require("../../virtualizing/Source/enum")
const Virtual = require("../Virtual")

var FunctionProcess = {
	set:async (scope, functionCall)=>{
		var target = await scope.getValue(functionCall.args[0]);
		var property = await scope.getValue(functionCall.args[1]);
		target[property] = await scope.getValue(functionCall.args[2])
		return null
	},
	log:async(scope,functionCall)=>{
		var object = await scope.getValue(functionCall.args[0])
		console.log(JSON.stringify(object,null," "))
		return object
	},
	throw:()=>{

	},
	declare:async (scope, functionCall)=>{
		var id = await scope.getValue(functionCall.args[0]);		
		var variable = await scope.getValue(functionCall.args[1],Virtual);
		scope.setValue(functionCall.scope.getVar(id),variable);
		return null
	},
	return:async (scope, functionCall)=>{
		var result = await scope.getValue(functionCall.args[0])
		return result
	}
}

module.exports = class FunctionsHandler extends Handler {
	
	async processFunctionCall(scope,functionCall){
		if(functionCall.function instanceof Sources.dynamicFunction){
			var dynamicFunction = functionCall.function;
			var child = scope.child()
			var index = 0
			for(var arg of functionCall.args){
				var value = await scope.getValue(arg);	
				child.setValue(dynamicFunction.scope.args[index++],value)
			}
			var result = await child.process(dynamicFunction.scope);
			return result;
		}
		else if(FunctionProcess[functionCall.function.name]){
			return await FunctionProcess[functionCall.function.name](scope,functionCall)
		}
	}
}