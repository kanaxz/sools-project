const Handler = require("../Handler");
const Functions = require("../../virtualizing/functions")

var FunctionProcess = {
	throw:()=>{

	},
	assignment:async (scope, functionCall)=>{
		scope.setValue(functionCall.args[1],await scope.getValue(functionCall.args[0]));
	},
	return:async (scope, functionCall)=>{
		return await scope.getValue(functionCall.args[0]);
	}
}

module.exports = class FunctionsHandler extends Handler {
	
	async processFunctionCall(scope,functionCall){
		if(Functions[functionCall.function.source.name])
			return await FunctionProcess[functionCall.function.source.name](scope,functionCall)
	}
}