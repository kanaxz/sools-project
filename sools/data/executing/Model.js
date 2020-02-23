const Model = require("../virtualizing/Virtual/enum/Model")
const Handler = require("../../executing/Handler")

module.exports = class ModelHandler extends Handler{

	canProcessFunctionCall(scope, functionCall){
		debugger
		return functionCall.function.type == Model
	}

	async processFunctionCall(scope, functionCall){
		debugger
		var model = await this.source.processArg(scope, functionCall.args[0]);
		await model.load();
	}

	canProcessArg(scope, model){
		return model instanceof Model
	}

	processArg(scope, model){

	}
}