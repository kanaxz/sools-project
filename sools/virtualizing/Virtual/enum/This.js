const Virtual = require("../index")
const Property = require('../../Source/enum/Property')
const FunctionCall = require('../../Source/enum/FunctionCall')

const getOwner = (source) => {
  if (source instanceof FunctionCall) {
    return getOwner(source.function.source)
  } else if (source instanceof Property) {
    return source.owner
  } else {
    throw new Error('Cannot find owner')
  }
}

const THIS = Virtual
  .define({
    name: 'this',
  })
  .handler((Handler) => {
    return class extends Handler {
      static build(options) {
        let owner = getOwner(options.source)
        return owner.constructor.build(options)
      }

      static buildArg(options) {
        let owner = getOwner(options.fn.source)
        return owner.constructor.buildArg(options)
      }
    }
  })

global.THIS = THIS
module.exports = THIS
