const sools = require("sools");
const Base = require("sools/Base");
const Array = require("./Array");

module.exports = sools.proxy([Array()], (base) => {
    class Instances extends base {
        constructor(type, values) {
            super(values);
            this.type = type;
        }
    }

    return Instances;
})