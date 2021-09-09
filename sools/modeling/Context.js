const Data = require("./utils")
const VContext =  require("./virtualizing/Virtual/enum/Context")
var sools = require("../../sools");
var Propertiable = require("../propertying/Propertiable");

module.exports =  Data.defineType({
	virtual:VContext,
	type:sools.define([Propertiable()]),
});