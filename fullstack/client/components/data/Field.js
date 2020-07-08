const Propertiable = require("sools/Propertiable")
const Properties = require("sools/Propertiable/Properties")
module.exports = sools.define([Propertiable()],(base)=>{
	return class Field extends Base {

	}
},[
	new Properties('name','error','in','max','min','required','fields')
])