const sools = require("sools");

const Condition = require("../../../Condition");
const Operation = require("../../index");
const Type = require("../../Type");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");
const Behavior = require("./Behavior");
module.exports = sools.define(Operation, [Propertiable()], (base) => {
    class Filter extends base {
        constructor(condition) {
            super();
            this.condition = condition;
        }
    }
    Behavior.model = Filter;
    return Filter;
}, [
    new Type('filter'),
    new Properties({
        condition: Properties.types.object({
            type: Condition
        })
    })
])