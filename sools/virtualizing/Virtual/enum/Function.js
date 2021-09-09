const Virtual = require("../index");
const Handler = require('../../Handler')
const DynamicFunction = require("../../Source/enum/DynamicFunction")
const FunctionSource = require("../../Source/enum/Function")
const FunctionCall = require("../../Source/enum/FunctionCall")
const sools = require('../../../sools')
//const Builder = require("../../Builder")
const FunctionArg = require("../../Source/enum/FunctionArg")
//const Scope = require("../../Scope")
const Env = require('../../Env')

console.log('Function')

const VirtualFunction = Virtual.define({
  name: 'function',
  class: (base) => {
    return class VirtualFunction extends sools.extends(Function, [base()]) {

      static define(options) {
        const virtualFunction = super.define(options)
        virtualFunction.args = options.args || this.args
        virtualFunction.return = options.return || this.return
        return virtualFunction
      }

      constructor(...args) {
        var options
        if (true) {
          options = args[0];
          if (options.source instanceof Array)
            options.source = new DynamicFunction({
              scope: options.scope,
              args: options.source[0],
              fn: options.source[1]
            })
        } else {
          var scope = args[0];
          var fnArgs = args[1]
          options = new HandlerOptions({
            scope: scope,
            source: new DynamicFunction({
              scope,
              args: fnArgs[1],
              fn: fnArgs[2]
            })
          })
        }
        super(options)
      }

      call(...args) {
        const scope = this._handler.scope.target
        args = args.map((arg) => arg && arg.virtual || arg)
        args = this._handler.buildArgs(scope, args)
        args = args.map((arg) => arg._handler || arg)

        const handlers = [this._handler.thisArg, ...args]
        handlers.reverse().forEach((arg) => {
          scope.processArg(arg);
        })

        const functionCall = new FunctionCall({
          scope,
          function: this,
          args
        })

        scope.statements.push(functionCall)
        if (this._handler.return)
          return this._handler.return(functionCall)
      }
    }
  },
  proxy: (BaseProxy) => {
    return class extends BaseProxy {
      apply(target, thisArg, args) {
        return target.call(...args)
      }
    }
  },
  handler: class Function extends Handler {

    constructor(options) {
      if (!options.thisArg) {
        options.thisArg = Env.global
      }

      super(options)
      this.thisArg = options.thisArg
      this.return = options.return || this.constructor.virtual.return
      this.args = options.args || this.constructor.virtual.args
    }

    buildArgs(scope, args) {
      args = [...args]
      var result = [];
      let descriptions = this.args || []
      if (typeof this.args === 'function') {
        descriptions = this.args(this.thisArg.virtual.constructor)
      }
      for (let description of descriptions) {
        if (description.isVirtual) {
          description = {
            type: description
          }
        }

        const arg = description.type.handler.buildArg({ scope, thisArg: this.thisArg, args, description })
        if (arg) {
          result.push(arg._handler)
        }
      }
      return result;
    }



    static callAsProperty(thisArg, property) {
      return {
        thisArg,
        args: property.args,
        return: property.return,
      }
    }

    static cast(args, fn) {
      return typeof (fn) == "function"
    }

    static parse(scope, args) {
      debugger
      throw new Error("parse function trigger");
      return new this.virtual(scope, args)
    }

    static buildArg(scope, thisArg, functionCallArgs, arg, argDescription) {
      var dynamicFunction;
      if (typeof (arg) == "function") {
        var options = arg;
        dynamicFunction = new DynamicFunction({
          scope,
          fn: arg,
          argDescription,
          thisArg,
          functionCallArgs,
        })
      } else if (typeof (arg) == "object" && arg.argNames && arg.statements) {
        var child = scope.child();
        dynamicFunction = new DynamicFunction(child);
        var args;
        if (typeof (argDescription.args) == "function") {
          args = argDescription.args(child, args, arg.argNames.map((argName) => {
            return new FunctionArg(argName.replace("$", ""), dynamicFunction)
          }))
        } else
          args = argDescription.args || []

        for (var statement of arg.statements) {
          Builder.functionCall(child, statement)
        }
        child.args = args.map((arg => arg._handler || arg));
        child.parent._child = null;
      }

      return new this.virtual({
        scope,
        source: dynamicFunction
      })
    }


  }
})

//Scope.function = VirtualFunction
FunctionSource.virtual = VirtualFunction
Virtual.Function = VirtualFunction
console.log("here", !!Virtual.Function)
module.exports = VirtualFunction