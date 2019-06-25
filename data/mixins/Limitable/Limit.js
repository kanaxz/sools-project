const sools = require("sools");

const Operation = require("../../Operation");
const OperationType = require("../../OperationType");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");
const Values = require("sools/Values");
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

    return Limit;
}, [
    new OperationType('limit'),
    new Properties({
        value: Properties.types.number()
    })
])