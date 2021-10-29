const Var = require("./Var");

module.exports = class FunctionArg extends Var {
  constructor(name, dynamicFunction) {
    super(name)
    this.dynamicFunction = dynamicFunction
  }
}