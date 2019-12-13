var Propertiable = require("../../../propertying/Propertiable");
var Properties = require("../../../propertying/Properties");
var Values = require("../../../Values");
var sools = require("../../../sools");
const Type = require("../../../typing/Type");
module.exports = sools.define([Propertiable(), Type()], (base) => {
    class OperatorType extends base {
        constructor(name) {
            super(new Values({
                name: name
            }))
        }
    }

    return OperatorType;
}, [
    new Properties({
        name: Properties.types.string()
    })
])