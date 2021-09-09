const BaseFunction = require("./BaseFunction")
const Meta = require("../../../meta")
const FunctionArg = require("./FunctionArg");
const utils = require("../../utils")
const Scope = require("../../Scope")

module.exports = class DynamicFunction extends BaseFunction {

  constructor(arg) {
    super();
    if (arg instanceof Scope)
      this.scope = arg;
    else {
      var options = arg;
      var argNames = Meta.getParamNames(options.fn);
      var sources = argNames.map((argName) => {
        return new FunctionArg(argName, this)
      })

      this.scope = options.scope.child();
      var fnArgs;
      if (options.argDescription) {
        fnArgs = options.argDescription.args && options.argDescription.args(this.scope, options.thisArg, options.functionCallArgs, sources) || []
      }
      else {
        fnArgs = options.args.map((arg, index) => arg.clone({
          scope: this.scope,
          source: sources[index]
        }))
      }
      this.scope.process(options.fn, ...fnArgs);
    }
  }

  buildArgs(scope, args) {
    return args;
  }


  toJSON() {
    return this.scope.toJSON();
  }


}