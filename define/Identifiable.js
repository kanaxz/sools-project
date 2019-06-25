var sools = require("sools")
var Identity = require("./Identity");
var Identities = require("./Identities");
var Propertiable = require("./Propertiable")
var Buildable = require("./Buildable");
var Comparable = require("./Comparable");
module.exports = sools.mixin([Propertiable()], (base) => {
    class Identifiable extends base {

        static identity(object){
            for (var identity of this.identities) {
                var properties = this.properties.getByNames(identity.propertyNames);
                var result = {};
                for (var property of properties) {
                    result[property.name] = object[property.name]
                }
                return result;
            }
        }

        static define(args) {

            var identities = args.filter((arg) => {
                return arg.constructor.dependencies && arg.constructor.dependencies.has(Identity);
            })

            if (identities.length != 0) {
                identities = new Identities(...identities);
                if (this.identities)
                    identities.push(this.identities);
                this.identities = identities;
            }
            super.define(args);
        }

        equals(object) {
            return this.constructor.identities.equal(this, object);
        }

        identity() {
            return this.constructor.identity(this);
        }
    }

    return Identifiable;
})