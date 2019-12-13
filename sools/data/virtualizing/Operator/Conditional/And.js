var sools = require("../../../../sools");
var Type = require("../Type");
var Operators = require("./Operators")
module.exports = sools.define(Operators, (base) => {
    class And extends base {}
    return And;
}, [
    new Type('and')
])