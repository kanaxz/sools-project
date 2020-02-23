const Virtualizing = require("../../index")
const String = require("./String");

module.exports = Virtualizing.defineType({
	name:'error',
	properties:{
		message:String
	},
})