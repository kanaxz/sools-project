var sools = require("sools");
var ConditionType = require("../ConditionType");
var Conditions = require("./Conditions")
module.exports = sools.define(Conditions, (base) => {
    class And extends base {}
    return And;
}, [
    new ConditionType('and')
])