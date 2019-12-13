var sools = require("../sools")
var NotImplemented = require("../errors/NotImplemented");
module.exports = sools.mixin((base) => {

    class Comparable extends base {

        equals(object) {
            throw new NotImplemented();
        }

    }

    return Comparable;
})