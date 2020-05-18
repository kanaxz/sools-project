const Handler = require("sools/executing/Handler");
const Function = require("sools/virtualizing/Source/enum/Function");
const String = require("sools/virtualizing/Virtual/enum/String")

const Encrypter = {
	handler:class extends Handler {
		async processFunctionCall(scope,functionCall){
			if(functionCall.function == Encrypter.encrypt){
				var string = await scope.getValue(functionCall.args[0]);

				return string;
			}
		}
	},
	encrypt:new Function({
		name:'encrypt',
		args:[String]
	})
}

module.exports = Encrypter