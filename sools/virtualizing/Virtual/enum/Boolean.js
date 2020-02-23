const Virtualizing = require("../../index");
const Base = require("./Base");
const Boolean =  Virtualizing.defineType({
	name:'boolean',
	extends:Base,
	handler:class Bool extends Base.handler{
		static cast(arg){
			return typeof(arg) == "boolean"		
		}
	}
})

Base.Boolean = Boolean
module.exports = Boolean;