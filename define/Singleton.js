var sools = require("sools")
var Validator = reuqire("./Validator");
module.exports = sools.mixin((base) => {

    class Singleton extends base {
        constructor(...args) {
            super(...args);
            if (this.constructor.instance)
                throw new Error();
            else
            	this.constructor.instance = this;
        }
    }

    return Singleton;
})