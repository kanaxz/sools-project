var sools = require("sools")
var NotImplemented = require("sools/errors/NotImplemented");
module.exports = sools.mixin((base) => {

    class Clonable extends base {
        clone() {
            throw new NotImplemented();
        }
    }

    return Clonable;
})