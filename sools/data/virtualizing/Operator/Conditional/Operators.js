var sools = require("../../../../sools");
var Operator = require("../index")
var Array = require("../../../../propertying/Array");
module.exports = sools.define(Operator, [Array({
    type: Operator
})], (base) => {
    class Operators extends base {
        constructor(conditions) {
            super();
            this.push(conditions);
        }
        push(...args) {
            for (var arg of args) {
                if (arg instanceof Operator) {
                    super.push(arg);
                } else {
                    for (var propertyName in arg) {
                        var value = arg[propertyName];
                        if (!value.isOperatorProxy) {
                            if (value instanceof Array) {

                            } else {
                                this.push(new $op.eq(propertyName, value));
                            }
                        } else {
                            this.push(new(value.type)(propertyName, ...value.args))
                        }
                    }
                }
            }
        }
    }

    return Operators;
})