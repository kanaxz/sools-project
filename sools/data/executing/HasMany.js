const Model = require("../virtualizing/Virtual/enum/Model")
const HasMany  = require("../virtualizing/Virtual/enum/HasMany")
const Handler = require("../../executing/Handler")

module.exports = class HasManyHandler extends Handler{
	canProcessFunctionCall(scope, functionCall){
		debugger
		return functionCall.function.type == HasMany
	}

	async processFunctionCall(scope, functionCall){
		debugger
		var hasMany = await this.source.processArg(scope, functionCall.args[0]);
		await hasMany.load();
	}
}