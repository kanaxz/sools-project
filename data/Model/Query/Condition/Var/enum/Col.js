var sools = require("sools");
var Properties = require("sools-define/Properties");
var Type = require("../Type");
var Var = require("../index")
module.exports = sools.define(Var, (base) => {
    class Col extends base {
        constructor(propertyName, value) {
            super();
            this.propertyName = propertyName;
        }
    }

    return Col;
}, [
    new Properties({
        propertyName: Properties.types.string()
    }),
    new Type('col')
])