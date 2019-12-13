const sools = require("../../../../sools")
const Statment =  require("../index");
const Return  = require("./Return")
const Type =  require("../Type")
const Reference =  require("../../Reference")
const Properties = require("../../../../propertying/Properties")

module.exports = sools.define(Statment,(base)=>{
	class Return extends base{
		constructor(reference){
			super();
			this.reference = reference;
		}
	}

	return Return
},[
	new Type("return"),
	new Properties({
		reference:Reference
	})
])