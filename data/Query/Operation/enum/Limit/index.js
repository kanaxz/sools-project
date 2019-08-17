const sools = require("sools");

const Operation = require("../../index");
const Type = require("../../Type");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");
const Values = require("sools/Values");
const Behavior  = require("./Behavior");
module.exports = sools.define(Operation, [Propertiable()], (base) => {
    class Limit extends base {
        constructor(value) {
            super();
            this.value = value;
        }

        processResult(type, results, next) {
            return next(results);
        }
    }

    Behavior.model = Limit;

    return Limit;
}, [
    new Type('limit'),
    new Properties({
        value: Properties.types.number()
    })
])