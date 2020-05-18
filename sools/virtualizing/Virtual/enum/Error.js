const Virtualizing = require("../../index")
const String = require("./String");
const Handler = require("../../Handler")
const Object = require("./Object")
module.exports = Virtualizing.defineType({
	name:'error',
	extends:Object,
	properties:{
		message:String
	}
})