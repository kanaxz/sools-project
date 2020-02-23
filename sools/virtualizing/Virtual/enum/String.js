const Virtualizing = require("../../index");
const Base = require("./Base");
const Number = require("./Number");
module.exports = Virtualizing.defineType({
	name:'string',
	extends:Base,
	handler:	class String extends Base.handler{
		static cast(arg){
			return typeof(arg) == "string"
		}
	},
	properties:{
		length:Number
	}
})