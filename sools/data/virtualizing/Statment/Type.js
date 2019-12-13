var sools = require("../../../sools");
const Type = require("../../../typing/Type");
var Propertiable = require("../../../propertying/Propertiable");
var Properties = require("../../../propertying/Properties");

module.exports = sools.define([Propertiable(), Type('statment')], (base) => {
    class StatmentType extends base {
        constructor(name) {
            super()
            this.name = name;
        }
    }

    return StatmentType;
}, [
    new Properties({
        name: Properties.types.string()
    })
])