var sools = require("../index")
var BindedFunctions = require("./BindedFunctions");

var symbol = Symbol("BindedFunctions");
module.exports = sools.mixin((baseClass) => {
    return class BindableFunctions extends baseClass {
        constructor(...args) {
        	super(...args);
            this[symbol] = new BindedFunctions(this);
        }

        b(fn) {
            return this[symbol].get(fn);
        }
    }
})