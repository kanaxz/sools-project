var sools = require("sools");
var Condition = require("../Condition")
var Array = require("sools-define/Array");
var Equal = require("./Equal")

module.exports = sools.define(Condition, [Array({
    type: Condition
})], (base) => {
    class Conditions extends base {
        constructor(conditions) {
            super();
            this.push(conditions);
        }
        push(...args) {
            for (var arg of args) {
                if (arg instanceof Condition) {
                    super.push(arg);
                } else {
                    for (var propertyName in arg) {
                        var value = arg[propertyName];
                        if (!value.isConditionProxy) {
                            if (value instanceof Array) {

                            } else {
                                this.push(new Equal(propertyName, value));
                            }
                        } else {
                            this.push(new(value.type)(propertyName, ...value.args))
                        }
                    }
                }
            }
        }
    }

    return Conditions;
})