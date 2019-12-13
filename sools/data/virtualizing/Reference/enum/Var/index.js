const sools = require("../../../../../sools");
const Properties = require("../../../../../propertying/Properties")
const Reference = require("../../index");
const Type = require("../../Type")

module.exports = sools.define(Reference,(base)=>{
	class Var extends base{
		static parse(arg){
			if(arg instanceof Var){
				return arg;
			}
			else
				return new Var.value(arg);
		}
	}

	return Var;
},[
	new Type("var"),
	new Properties({
		id:Properties.types.string(),
		path:Properties.types.string()
	})
])
