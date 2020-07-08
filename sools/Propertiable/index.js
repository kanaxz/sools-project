var sools = require("../sools");
var Properties = require("./Properties");
var Values = require("../Values");
var Buildable = require("../building/Buildable");
var Comparable = require("../comparing/Comparable");
const comparing = require("../comparing");
const Clonable = require("../cloning/Clonable");
const Event = require("../Event")
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
            try {
              Object.defineProperty(this.prototype, property.name, {
                get: function() {
                  return this._values[property.name];
                },
                set: function(newValue) {
                  this._setValue(property, newValue)
                }
              })
            } catch (e) {
              console.log(property, e)
            }
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
        var property = this.properties.get(propertyName);
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
        var property = properties.get(propertyName);
        result[propertyName] = property.toJSON(values[propertyName]);
      }
      return result;
    }

    toJSON() {
      return this.constructor.toJSON(this._values);
    }

    equals(object) {
      return comparing.equal(this, object, this.constructor.properties);
    }

    constructor(values) {
      super();
      this.onPropertySet = new Event();
      this._values = {};

      if (values) {
        this._set(values);
      }
    }

    _set(values) {
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
    	//console.log(propertyName)
      this.onPropertySet.trigger(propertyName, newValue, oldValue)
    }

    _setValue(property, newValue, oldValue) {
      var oldValue = this._values[property.name];
      newValue = property.transform(this, newValue);
      this.settingProperty(property, newValue, oldValue)
      property.set(this, newValue, oldValue)
      this.propertySet(property.name, newValue, oldValue);
    }
  }
  return Propertiable
})