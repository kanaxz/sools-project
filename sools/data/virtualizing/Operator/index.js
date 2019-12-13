var sools = require("../../../sools");
var Propertiable = require("../../../propertying/Propertiable");
var Type = require("./Type");
var Typeable = require("../../../typing/Typeable");
module.exports = sools.define([Propertiable(), Typeable(Type)])