var Tree = require("sools/Tree");
var sools = require("sools")
var utils = require("./utils");

class Identities extends Tree {

    equal(instance, object) {
        for (var identity of this) {
            var properties = instance.constructor.properties.getByNames(identity.propertyNames);
            if (utils.equal(instance, object, properties))
                return true;
        }
        return false
    }
}
module.exports = Identities;