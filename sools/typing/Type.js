var sools = require("../sools");

var Comparable = require("../comparing/Comparable");
module.exports = sools.mixin([Comparable()], (base, name) => {
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

    Type.typeName = name || 'type';

    return Type;
})