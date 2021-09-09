const Query = require("../virtuals/Query")
const RootPath = require("../virtuals/RootPath")
const utils = require("../utils")
const Virtuals = require("sools/modeling/virtualizing/Virtual/enum")
const Path = require("../virtuals/Path")
const Expression = require("../virtuals/Expression")
const Handler = require("./Handler");
const mongo = require('mongodb');


module.exports = class Datas extends Handler {
	async processFunctionCall(scope, functionCall){
		if(functionCall.args[0] instanceof Virtuals.datas.handler){
			return new Query(functionCall.function.name, this.source)
		}
	}
}