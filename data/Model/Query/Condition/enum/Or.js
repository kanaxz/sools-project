var sools = require("sools");
var ConditionType = require("../ConditionType");
var Conditions = require("./Conditions")
module.exports = sools.define(Conditions, (base) => {
    class Or extends base {}
    return Or;
}, [
    new ConditionType('or')
])