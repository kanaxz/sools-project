const sools = require("../../../sools")
const Propertiable = require("../../../propertying/Propertiable")
const Properties = require("../../../propertying/Properties")
const Type = require("../../../typing/Type")

module.exports = sools.define([Propertiable(), Type('var')], (base) => {
    class Var extends base {
        constructor(name) {
            super()
            this.name = name;
        }
    }

    return Var;
}, [
    new Properties({
        name: Properties.types.string()
    })
])