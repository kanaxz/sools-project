const Virtualizing = require("../../index");
const Base = require("./Base");
const Virtual = require("../index");
const Boolean =  Virtualizing.defineType({
	name:'boolean',
	extends:Base,
	handler:class Bool extends Base.handler{
		static cast(arg){
			return typeof(arg) == "boolean"		
		}
	}
})

Virtual.boolean = Boolean;
Base.Boolean = Boolean
module.exports = Boolean;