var sools = require("../../sools");
var Propertiable = require("../../propertying/Propertiable");
var Properties = require("../../propertying/Properties");
var Uniqueable = require("../../building/Uniqueable");
var Values = require("../../Values");

const Type = require("../../typing/Type");

module.exports = sools.define([
    Propertiable(),
    Uniqueable({
        cache: false
    }),
    Type('model')
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