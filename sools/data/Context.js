const Data = require("./index")
const VContext =  require("./virtualizing/Virtual/enum/Context")
var sools = require("../../sools");
var Propertiable = require("../Propertiable");

module.exports =  Data.defineType({
	virtual:VContext,
	type:sools.define([Propertiable()]),
});