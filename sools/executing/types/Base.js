const Handler = require("../Handler");
const Base = require("../../virtualizing/Virtual/enum/Base")

module.exports = class ArrayHandlere extends Handler {
	processFunctionCall(scope,functionCall,next){
		if(functionCall.function.type == Base){
			if(!this[functionCall.function.name])
				throw new Error(`Base method not implemented '${functionCall.function.name}'`)
			return this[functionCall.function.name](scope,functionCall)
		}
		return next();
	}

	async lt(scope,functionCall){
		var arg1 = await scope.getValue(functionCall.args[0])
		var arg2 = await scope.getValue(functionCall.args[1])
		return arg1 < arg2
	}

	async gt(scope,functionCall){
		var arg1 = await scope.getValue(functionCall.args[0])
		var arg2 = await scope.getValue(functionCall.args[1])
		return arg1 > arg2
	}
}