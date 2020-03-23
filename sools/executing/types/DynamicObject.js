const Handler = require("../Handler");
const DynamicObject = require("../../virtualizing/Virtual/enum/DynamicObject");

module.exports = class DynamicObjectHandler extends Handler {

	async processArg(scope,object){
		if(!(object instanceof DynamicObject.handler))
			return
		var result = {};
		for(var p in object.virtual){
			result[p] = await scope.getValue(object.virtual[p]._handler);
		}
		return result;
	}
}