var sools = require("sools");

var Comparable = require("./Comparable");
const Uniqueable = require("./Uniqueable");
module.exports = sools.mixin([Comparable()], (base) => {
    class Type extends base {
        attach(classObject) {
            this.class = classObject;
        }

        build(...args) {
            return this.class.build(...args);
        }

        new(...args) {
            return new this.class(...args);
        }
    }

    return Type;
})