const Handler = require("../Handler");
const Array = require("../../virtualizing/Virtual/enum/Array")

module.exports = class ArrayHandlere extends Handler {
	processFunctionCall(scope,functionCall,next){
		if(functionCall.function.type == Array){
			if(!this[functionCall.function.name])
				throw new Error(`Array method not implemented '${functionCall.function.name}'`)
			return this[functionCall.function.name](scope,functionCall)
		}
		return next();
	}

	async push(scope, functionCall){
		var array = await scope.getValue(functionCall.args[0]);
		var values = await scope.getValue(functionCall.args[1]);
		array.push(...values);

		return
	}

	async reduce(){

	}

	async find(scope,functionCall){
		var array = await scope.getValue(functionCall.args[0]);
		for(var object of array){
			var child = scope.child();
			child.setValue(functionCall.args[1].source.scope.args[0],object);
			var result = await child.process(functionCall.args[1].source.scope);
			if(result)
				return object;
		}
		return null
	}

	async length(scope,functionCall){
		return (await scope.getValue(functionCall.args[0])).length
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

	async atIndex(scope,functionCall){
		var array = await scope.getValue(functionCall.args[0]);
		var index = await scope.getValue(functionCall.args[1])
		return array[index]
	}

	async indexOf(scope,functionCall){
		var array = await scope.getValue(functionCall.args[0]);
		var object = await scope.getValue(functionCall.args[1])
		return array.indexOf(object);
	}
}