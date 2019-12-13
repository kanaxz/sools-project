var sools = require("../../../../sools");
var Type = require("../Type");
var Operators = require("./Operators")
module.exports = sools.define(Operators, (base) => {
    class Or extends base {}
    return Or;
}, [
    new Type('or')
])