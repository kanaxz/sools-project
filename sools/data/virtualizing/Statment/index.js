var sools = require("../../../sools")

var Typeable = require("../../../typing/Typeable")
var Properties = require("../../../propertying/Properties");
var Propertiable = require("../../../propertying/Propertiable");
var Type = require("./Type");

module.exports = sools.define([
	Propertiable(),
    Typeable(Type)
], (base) => {
    class Statment extends base {

    }
    return Statment;
})