const sools = require("sools");
const Properties = require("sools/Propertiable/Properties");
const Definition = require("../Definition");

module.exports = sools.define(Definition,(base)=>{
	class ViewDefinition extends base{

	}
	return ViewDefinition;
},[
	new Properties('layout')
])