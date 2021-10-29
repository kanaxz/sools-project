const ArraySource = require("../../Source/enum/Array")
const Virtual = require("../../Virtual")
const Template = require('./Template')
const Enumerable = require('./Enumerable')

const template = Template.of(Virtual)

const VirtualArray = Enumerable
  .define({
    name: 'Array',
    template,
  })
  .handler((Handler) => {
    return class extends Handler {

      constructor(options) {
        super(options)
      }

      static buildArg(options) {
        const { scope, args, description } = options
        if (description.spread) {
          const spreadArgs = []
          while (args.length) {
            spreadArgs.push(args.shift())
          }
          options.args = [spreadArgs]
        }
        return super.buildArg(options)

      }

      static parse(scope, array) {
        if (!(array instanceof Array)) {
          throw new Error()
        }
        array = array.map((value) => {
          if (!(value instanceof this.template)) {
            value = this.template.handler.parse(scope, value)
          }
          return value._handler || value
        });
        [...array].reverse().forEach((value) => {
          scope.processArg(value)
        })
        return this.build({
          scope,
          source: new ArraySource(array)
        })
      }

      static cast(arg) {
        return arg instanceof Array
      }
    }
  })
  .methods({
    push: [[Array.of(template).define({ spread: true })]],
  })

module.exports = VirtualArray;