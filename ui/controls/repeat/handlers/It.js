const sools = require("sools");
const Propertiable = require("sools/Propertiable")
const Properties = require("sools/Propertiable/Properties")
module.exports = sools.define([Propertiable()], (base) => {
    class It extends base {
    	constructor(values){
    		super(values)
    	}
    }

    return It;
}, [
    new Properties('object')
])