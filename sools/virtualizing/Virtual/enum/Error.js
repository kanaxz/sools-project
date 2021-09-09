const Virtualizing = require("../../index")
const String = require("./String");
const Handler = require("../../Handler")
const Object = require("./Object")
module.exports = Object.define({
	name:'error',
	properties:{
		message:String
	}
})