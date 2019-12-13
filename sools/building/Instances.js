const sools = require("../sools");
const Base = require("../core/Base");
const Array = require("../propertying/Array");

module.exports = sools.proxy([Array()], (base) => {
    class Instances extends base {
        constructor(type, values) {
            super(values);
            this.type = type;
        }
    }

    return Instances;
})