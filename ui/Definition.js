const sools = require("sools");
const Propertiable = require("sools-define/Propertiable")
const Properties = require("sools-define/Properties")
const Values = require("sools/Values");
module.exports = sools.define([Propertiable()], (base) => {
	class Definition extends base{
		constructor(values){
			super(new Values(values));
		}
	}
	return Definition;

}, [
    new Properties('name', 'template', 'transclude','constantes')
])