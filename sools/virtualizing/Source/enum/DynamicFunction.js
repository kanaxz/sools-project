const BaseFunction = require("./BaseFunction")
const Meta = require("../../../meta")
const FunctionArg = require('./FunctionArg')
const utils = require('../../utils')

module.exports = class DynamicFunction extends BaseFunction {

  constructor(options) {
    super()
    this.owner = options.owner
    this.scope = options.scope.child()
    const argNames = Meta.getParamNames(options.fn)
    const args = options.args.map((arg, index) => {
      return arg.handler.build({
        scope: this.scope,
        source: new FunctionArg(argNames[index] || utils.gererateVariableId(), this)
      })
    })
    this.scope.process(options.fn, args)
  }

  toJSON() {
    return this.scope.toJSON()
  }
}