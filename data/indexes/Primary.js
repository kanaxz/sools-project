const sools = require("sools");
const Unique = require("./Unique");

module.exports = sools.define(Unique, (base)=>{
	class Primary extends base{

	}

	return Primary;
})