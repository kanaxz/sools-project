var sools = require("sools");
var Propertiable = require("sools-define/Propertiable");
var Type = require("./Type");
var Typeable = require("sools-define/Typeable");
module.exports = sools.define([Propertiable(), Typeable(Type)])