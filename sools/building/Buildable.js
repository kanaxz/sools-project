var sools = require("../sools")
var NotImplemented = require("../errors/NotImplemented");
module.exports = sools.mixin((base) => {

    class Buildable extends base {

        static build(object, options) {
            throw new NotImplemented();
        }

        toJSON(options) {
            throw new NotImplemented();
        }
    }

    return Buildable;
})