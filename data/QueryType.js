var sools = require("sools");

const Type = require("sools-define/Type");
var Propertiable = require("sools-define/Propertiable");
var Properties = require("sools-define/Properties");

module.exports = sools.define([Propertiable(), Type()], (base) => {
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