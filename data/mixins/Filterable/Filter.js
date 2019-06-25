const sools = require("sools");

const Condition = require("../../Condition");
const Operation = require("../../Operation");
const OperationType = require("../../OperationType");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");;
module.exports = sools.define(Operation, [Propertiable()], (base) => {
    class Filter extends base {
        constructor(condition) {
            super();
            this.condition = condition;
        }
    }

    return Filter;
}, [
    new OperationType('filter'),
    new Properties({
        condition: Properties.types.object({
            type: Condition
        })
    })
])