var sools = require("../../sools");

const Type = require("../../typing/Type");
var Propertiable = require("../../propertying/Propertiable");
var Properties = require("../../propertying/Properties");

module.exports = sools.define([Propertiable(), Type('query')], (base) => {
    class QueryType extends base {
        constructor(name) {
            super()
            this.name = name;
        }
    }

    return QueryType;
}, [
    new Properties({
        name: Properties.types.string()
    })
])