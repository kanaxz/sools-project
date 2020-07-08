const VModel = require("./virtualizing/Virtual/enum/Model");
const Propertiable = require("../Propertiable");
const Properties = require("../Propertiable/Properties")
const Base = require("../core/Base");
const sools = require("../index")
const Virtualizing = require("../virtualizing")
const associations = require("./Association/enum");
var propertyTypes = require("../Propertiable/Property/types");
var virtualTypes = require("./virtualizing/Virtual/enum")
const VObject = require("../virtualizing/Virtual/enum/Object")

var virtualPropertyMapping = [
  ['number', () => ({ type: virtualTypes.number })],
  ['string', () => ({ type: virtualTypes.string })],
  ['boolean', () => ({ type: virtualTypes.boolean })],
  ['hasMany', (property) => ({
    type: virtualTypes.hasMany.of(property.model.virtual),
    load: property.load
  })],
  ['array', (property) => ({
    type: virtualTypes.array.of(property.model.virtual)
  })],
  ['datetime', (property) => ({
    type: virtualTypes.datetime
  })]
]

var propertyMapping = [
  ['number', () => (propertyTypes.number())],
  ['string', () => (propertyTypes.string())],
  ['boolean', () => (propertyTypes.bool())],
  ['hasMany', (property) => (propertyTypes.hasMany({
    type: property.model.type,
    load: property.load
  }))],
  ['array', (property) => (propertyTypes.array({
    type: property.model.type
  }))],
  ['datetime', (property) => (propertyTypes.date({

  }))]

]

class TypeDescription {
  constructor(values) {
    for (var p in values)
      this[p] = values[p];
  }

  registerProperties(properties) {
    var typeProperties = {};
    var virtualProperties = {};
    for (var propertyName in properties) {
      var property = properties[propertyName]; {
        var kv = virtualPropertyMapping.find((kv) => kv[0] == property.type);
        if (property instanceof TypeDescription) {
          property = {
            type: property
          }
        }
        if (kv) {
          virtualProperties[propertyName] = kv[1](property);
        } else {
          virtualProperties[propertyName] = {
            type: property.type.virtual,
            load: property.load
          }
        }
      } {
        var tkv = propertyMapping.find((tkv) => tkv[0] == property.type)
        if (tkv) {
          typeProperties[propertyName] = tkv[1](property)
        } else if (this.virtual.prototype instanceof VModel) {
          typeProperties[propertyName] = associations.hasOne({

          })
        } else {
          console.log("nowhere", propertyName)
          typeProperties[propertyName] = propertyTypes.object({
            type: property.type.type
          })
        }
      }
    }
    this.type.define([new Properties(typeProperties)]);
    this.virtual.registerProperties(virtualProperties);
  }
}

var Data = {
  defineType: (typeDescription) => {
    if (!typeDescription.virtual) {
      typeDescription.virtual = Virtualizing.defineType({
        name: typeDescription.name,
        extends: typeDescription.extends && typeDescription.extends.virtual
      })
    }
    if (!typeDescription.type)
      typeDescription.type = sools.define(typeDescription.extends && typeDescription.extends.type || Base)
    var instance = new TypeDescription(typeDescription);
    if (typeDescription.properties)
      instance.registerProperties(typeDescription.properties);
    return instance
  },
  define: (models, result) => {
    result = result || {};
    for (let modelName in models) {
      var modelDescription = models[modelName]
      result[modelName] = Data.defineType({
        name: modelName,
        pluralName: modelName + "s",
        extends: modelDescription.extends
      })
    }

    for (let modelName in models) {
      var model = models[modelName];
      var vproperties = {};
      var properties = {}
      for (let propertyName in model.properties) {
        let property = model.properties[propertyName];
        if (typeof(property) == "string") {
          property = {
            type: property
          }
        } else if (property instanceof Array) {
          var arg = property[0];

          if (result[arg] instanceof TypeDescription) {
            var m = result[arg]
            if (m.virtual.prototype instanceof VModel) {
              property = {
                type: 'hasMany',
                model: m,
                load: (model, hasMany) => {
                  return hasMany.filter((subModel) => {
                    if (!subModel[modelName])
                      debugger
                    return subModel[modelName].eq(model)
                  })
                }
              }
            } else {
              console.log("array", propertyName)
              property = {
                type: 'array',
                model: m,
                load: (model, hasMany) => {
                  return hasMany.filter((subModel) => {
                    if (!subModel[modelName])
                      debugger
                    return subModel[modelName].eq(model)
                  })
                }
              }
            }
          } else {
            property = {
              type: 'array',
              model: Data.define({
                [propertyName]: {
                  extends: Data.object,
                  properties: arg
                }
              }, result)[propertyName]
            }
          }
        } else if (typeof(property) == "object") {
          property = Data.define({
            [propertyName]: {
              extends: Data.object,
              properties: property
            }
          }, result)[propertyName]
        }
        if (result[property.type]) {
          property.type = result[property.type];
          if (property.type.virtual.prototype instanceof VModel) {
            if (property.has === false) {
              property.load = (m, models) => {
                return models.filter((subModel) => {
                  return m.eq(subModel[model.name])
                })
              }
            } else if (!property.load) {
              property.load = (m, models) => {
                return models.filter((subModel) => {
                  return m[property.type.name].eq(subModel)
                })
              }
            }
          }
        }
        model.properties[propertyName] = property;
      }
      result[modelName].registerProperties(model.properties);

    }
    return result;
  }
}

Data.object = Data.defineType({
  type: sools.define([Propertiable()], (base) => {
    return class Object extends base {

      constructor(values) {
        super(values);
        this.default();
      }

      attach(datas) {
        this.datas = datas;
      }
    }
  }),
  virtual: VObject
})

module.exports = Data;