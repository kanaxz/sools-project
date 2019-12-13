const sools = require("../../../sools");
const Properties = require("../../../propertying/Properties")
const Propertiable = require("../../../propertying/Propertiable")
const Type = require("./Type");
const Typeable = require("../../../typing/Typeable");

module.exports = sools.define([Propertiable(), Typeable(Type)],(base)=>{
	class Reference extends base{
		
	}

	return Reference;
})
