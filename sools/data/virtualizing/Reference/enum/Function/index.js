const sools = require("../../../../../sools")
const Statment =  require("../../../Statment");
const Reference = require("../../index")
const Return  = require("../../../Statment/enum/Return")
const Type =  require("../../Type")
const Properties = require("../../../../../propertying/Properties")
const Scope = require("./Scope")
module.exports = sools.define(Reference,[],(base)=>{
	class Function extends base{
		constructor(statments){
			super();
			this.statments = statments;
		}
	} 

	return Function
},[
	new Type("function"),
	new Properties({
		statments:Properties.types.array({
			type:Statment
		})
	})
])