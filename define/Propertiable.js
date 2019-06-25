var sools = require("sools");
var Properties = require("./Properties");
var Values = require("sools/Values");
var Buildable = require("./Buildable");
var Comparable = require("./Comparable");
var utils = require("./utils");
const Observable = require("./Observable");
const Clonable = require("./Clonable");
module.exports = sools.mixin([Buildable(), Comparable()], (base) => {
    class Propertiable extends base {

        static define(args) {
            var propertiesArray = args.filter((arg) => {
                return arg instanceof Properties;
            })
            if (propertiesArray.length != 0) {
                var newProperties = new Properties();
                if (this.properties)
                    newProperties.push(this.properties);
                for (var properties of propertiesArray) {
                    properties.forEach((property) => {
                        property.attachType(this);
                        Object.defineProperty(this.prototype, property.name, {
                            get: function() {
                                return this._values[property.name];
                            },
                            set: function(newValue) {
                                this.setValue(property, newValue)
                            }
                        })
                    })
                    newProperties.push(properties);
                }

                this.properties = newProperties;
            }
            super.define(args);
        }

        static build(object, options) {
            var values = {};
            var properties = this.properties;
            var instance = new(this)();
            for (var propertyName in object) {
                var property = this.properties.getByName(propertyName);
                if (property) {
                    if (property.canBuild(object[propertyName]))
                        instance[propertyName] = property.build(object[propertyName], options);
                }
            }
            instance.default();
            return instance;
        }

        static toJSON(values) {
            var result = {};
            var properties = this.properties;
            for (var propertyName in values) {
                var property = properties.getByName(propertyName);
                result[propertyName] = property.toJSON(values[propertyName]);
            }
            return result;
        }

        toJSON() {
            return this.constructor.toJSON(this._values);
        }

        equals(object) {
            return utils.equal(this, object, this.constructor.properties);
        }

        constructor(...args) {
            super(...args);
            var values = args.find((arg)=>{
                return arg instanceof Values;
            })
            this._values = {};

            if (values) {
                this.set(values);
            }
        }

        set(values) {
            for (var propertyName in values) {
                this[propertyName] = values[propertyName];
            }
        }

        merge(object) {
            //console.log("merging", this.constructor.name, this, object)
        }

        default () {
            var properties = this.constructor.properties;
            if (properties) {
                for (var property of properties) {
                    if (this[property.name] == null) {
                        if (property.setDefault || property.defaultValue)
                            this[property.name] = property.default();
                    }
                }
            }
        }

        settingProperty(property, newValue, oldValue) {

        }

        propertySet(propertyName, newValue, oldValue) {
            //this.onPropertySet.trigger(propertyName, newValue, oldValue)
        }

        setValue(property, newValue, oldValue) {
            var oldValue = this._values[property.name];
            newValue = property.transform(this, newValue);
            this.settingProperty(property, newValue, oldValue)
            property.set(this, newValue, oldValue)
            this.propertySet(property.name, newValue, oldValue);
        }
    }
    return Propertiable
})