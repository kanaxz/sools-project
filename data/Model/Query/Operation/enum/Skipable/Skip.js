const sools = require("sools");

const Operation = require("../Operation");
const OperationType = require("../OperationType");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");
const Values = require("sools/Values");
module.exports = sools.define(Operation,[Propertiable()],(base)=>{
	class Skip extends base {
		constructor(value){
			super(new Values({
				value:value
			}));
		}
	}

	return Skip;
},[
	new OperationType('skip'),
	new Properties({
		value:Properties.types.number()
	})
])