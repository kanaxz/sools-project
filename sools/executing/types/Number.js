const Handler = require("../Handler");
const Number = require("../../virtualizing/Virtual/enum/Number")

module.exports = class ArrayHandlere extends Handler {
	processFunctionCall(scope,functionCall,next){
		if(functionCall.function.type == Number){
			if(!this[functionCall.function.name])
				throw new Error(`Number method not implemented '${functionCall.function.name}'`)
			return this[functionCall.function.name](scope,functionCall)
		}
		return next();
	}

	async multiply(scope,functionCall){
		var arg1 = await scope.getValue(functionCall.args[0])
		var arg2 = await scope.getValue(functionCall.args[1])
		return arg1 * arg2
	}
}