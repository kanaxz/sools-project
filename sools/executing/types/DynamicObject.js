const Handler = require("../Handler");
const DynamicObject = require("../../virtualizing/Virtual/enum/DynamicObject");

module.exports = class DynamicObjectHandler extends Handler {

	canProcessArg(scope,object){
		return object instanceof DynamicObject.handler
	}

	async processArg(scope,object){
		var result = {};
		for(var p in object.virtual){
			result[p] = await this.getValue(object.virtual[p]._handler)
		}
		return result;
	}
}