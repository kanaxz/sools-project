const Handler = require("../Handler");
const Array = require("../../virtualizing/Virtual/enum/Array")

module.exports = class ArrayHandlere extends Handler {
	processFunctionCall(scope,functionCall){
		if(functionCall.function.type == Array){
			return this[functionCall.function.name](scope,functionCall)
		}
	}

	async forEach(scope,functionCall){
		var array = await scope.getValue(functionCall.args[0])
		for(var object of array){
			var child = scope.child();
			child.setValue(functionCall.args[1].source.scope.args[0],object);
			await child.process(functionCall.args[1].source.scope);
		}
		return array;
	}


}