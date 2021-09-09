const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Function = require("../../../../virtualizing/Virtual/enum/Function")
const utils = require("../utils")
const Model = require("./Model")

const HasMany = Array.defineType({
  name: 'hasMany',
  template: Model,
  handler: class HasManyHandler extends Array.handler {
    constructor(options) {
      super(options);
      if (options.property)
        this.property = options.property
    }
    static callAsProperty(scope, property) {
      return {
        property: property
      }
    }
  },
  methods: (HasMany) => ({
    unload: {
      return: THIS,
      /*
      return: (functionCall) => {
        var hasMany = functionCall.args[0]
        return hasMany.clone({
          source: functionCall
        })
      },
      /**/
      args: [
        HasMany
      ]
    },
    load: {
      return: THIS,
      /*
      return: (functionCall) => {
        var hasMany = functionCall.args[0];
        return hasMany.clone({
          source: functionCall
        })
      },
      /**/
      args: [
        {
          type: Function,
          args: (scope, args, argNames) => {
            return [
              new (Array.of(args[0].template))({
                scope,
                source: argNames[0],
              })
            ]
          }
        }
      ]
    }
  })
})


utils.hasMany = HasMany;
module.exports = HasMany
