var sools = require("sools");
var Condition = require("../Condition")

module.exports = sools.define(Condition, (base) => {
    class Conditions extends base {
        constructor(conditions) {
            super();
            this.push(conditions);
        }
       
    }

    return Conditions;
})