var Tree = require("../../Tree");
var sools = require("../../sools")
var comparing = require("../../comparing");

class Identities extends Tree {

    equal(instance, object) {
        for (var identity of this) {
            var properties = instance.constructor.properties.getByNames(identity.propertyNames);
            if (comparing.equal(instance, object, properties))
                return true;
        }
        return false
    }
}
module.exports = Identities;