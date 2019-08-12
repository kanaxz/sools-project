var Propertiable = require("sools-define/Propertiable");
var Properties = require("sools-define/Properties");
var Uniqueable = require("sools-define/Uniqueable");
var Values = require("sools/Values");
var sools = require("sools");
const Type = require("sools-define/Type");

module.exports = sools.define([
    Propertiable(),
    Uniqueable({
        cache: false
    }),
    Type()
], (base) => {
    class ModelType extends base {
        constructor(name) {
            super(new Values({
                name: name
            }))
        }
    }

    return ModelType;
}, [
    new Properties({
        name: Properties.types.string()
    })
])