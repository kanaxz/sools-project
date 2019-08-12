var Propertiable = require("sools-define/Propertiable");
var Properties = require("sools-define/Properties");
var Values = require("sools/Values");
var sools = require("sools");
const Type = require("sools-define/Type");
module.exports = sools.define([Propertiable(), Type()], (base) => {
    class OperatorType extends base {
        constructor(name) {
            super(new Values({
                name: name
            }))
        }
    }

    return ConditionType;
}, [
    new Properties({
        name: Properties.types.string()
    })
])