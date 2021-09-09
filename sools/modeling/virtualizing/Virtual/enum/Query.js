const Array = require('../../../../virtualizing/Virtual/enum/Array')
const Model = require('./Model')

const template = Template.for(Model)

module.exports = Array.define({
  name: 'query',
  template,
  methods: {
    get: {
      return: Array.of(template)
      /*
      return: (functionCall) => {
        const result = new (Array.of(functionCall.function.thisArg.template))({
          source: functionCall,
        })
        return result
      },
      /**/
    },
    update: {
      args: (T, args) => {
        return [{
          type: Function,
          required: true,
          args: [Array.of(template)]
          /*
          args: (scope, args, argNames) => {
            return [new (Array.of(args[0].template))(new Options({
              scope,
              source: argNames[0]
            }))]
          }
          /**/
        }, {
          type: Function,
          required: true,
          args: [Array.of(template)]
          /*
          args: (scope, args, argNames) => {
            return [new (args[0].template)(new Options({
              scope,
              source: argNames[0]
            }))]
          }
          /**/
        }]
      }
    },
    delete: {
      args: (T, args) => {
        return [{
          type: Function,
          required: false,
          args:[template, Function]
          /*
          args: (scope, args, argNames) => {
            return [new args[0].template(new Options({
              scope,
              source: argNames[0],
            })), new Function(new Options({
              scope,
              source: new Sources.function({
                name: argNames[1]
              })
            }))]
          }
          /**/
        }]
      }
    },
  }
})