var sools = require("sools");
var Propertiable = require("sools-define/Propertiable");
var ConditionType = require("./ConditionType");
var Typeable = require("sools-define/Typeable");
module.exports = sools.define([Propertiable(), Typeable(ConditionType)])