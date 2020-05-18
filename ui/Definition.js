const sools = require("sools");
const Propertiable = require("sools/Propertiable")
const Properties = require("sools/Propertiable/Properties")

module.exports = sools.define([Propertiable()], (base) => {
	class Definition extends base{
		constructor(values){
			super(values);
		}
	}
	return Definition;

}, [
    new Properties('name', 'template', 'transclude','constantes')
])