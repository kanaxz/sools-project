var sools = require("sools")
var Validator = reuqire("./Validator");
module.exports = sools.define([Validator()], (base, baseType) => {

    class Required extends base {
        constructor(propertyNames) {
            super();
            this.propertyNames = propertyNames;
        }

        validate(validateable) {
            
        }
    }

    return Required;
})