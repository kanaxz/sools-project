var sools = require("sools");
var Properties = require("sools-define/Properties");
var ConditionType = require("../ConditionType");
var Condition = require("../Condition")
module.exports = sools.define(Condition, (base) => {
	class Like extends base {
		constructor(propertyName, value){
			super();
			this.propertyName = propertyName;
			this.value = value;
		}
	}

	return Like;
},[
	new Properties({
		propertyName:Properties.types.string(),
		value: Properties.types.object()
	}),
	new ConditionType('like')
])