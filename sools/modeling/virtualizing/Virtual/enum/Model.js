const Virtual = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Boolean = require("../../../../virtualizing/Virtual/enum/Boolean")
const Object = require("../../../../virtualizing/Virtual/enum/Object")
const utils = require("../utils")
const Function = require("../../../../virtualizing/Virtual/enum/Function")

const Model = Object.define({
  name: 'model',
  handler: class ModelHandler extends Object.handler {
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
  methods: (Model) => ({
    unload: {
      return: (functionCall) => {
        var model = functionCall.args[0];
        return model.clone({
          source: functionCall
        })
      },
      args: [
        Model
      ]
    },
    load: {
      return: (functionCall) => {
        var model = functionCall.args[0];
        return model.clone({
          source: functionCall
        })
      },
      args: (T) => [
        {
          type: Function,
          args: (scope, args, argNames) => {
            return [
              new (Array.of(args[0].constructor.virtual))({
                scope,
                source: argNames[0]
              })
            ]
          }
        }
      ]
    }
  })
})

module.exports = Model
