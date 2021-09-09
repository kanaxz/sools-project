const Scope = require('./Scope')
const ArrayUtils = require("../Array/utils")
const handlers = [
  require("./types/Array"),
  //require("./types/DynamicObject"),
  require("./types/Functions"),
  require("./types/Base"),
  require("./types/Virtual"),
  require("./types/Number"),
  //require("./types/Sources")
]

module.exports = class Executor {
  constructor(options) {
    this.handlers = options.handlers;
  }

  static handlers() {
    return handlers.map((handler) => new handler())
  }

  async start(scope, next) {
    for (var handler of this.handlers)
      await handler.start(this)
  }

  async processFunctionCall(scope, functionCall) {
    return await ArrayUtils.chain(this.handlers, async (handler, next) => {
      return await handler.processFunctionCall(scope, functionCall, next)
    }, () => {
      throw new Error(`no handler found for functionCall ${functionCall.function.name}`);
    })
  }


  async process(vscope, vars) {
    var workingScope = new Scope(this)
    for (var v in vscope.vars)
      workingScope.setValue(vscope.getVar(v), vars[v]);

    for (var handler of this.handlers)
      await handler.init(workingScope, vscope)

    return await workingScope.process(vscope);
  }

  async stop() {
    for (var handler of this.handlers)
      await handler.stop();
  }
}