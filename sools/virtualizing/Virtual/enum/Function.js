const Virtual = require("../index")
const DynamicFunction = require("../../Source/enum/DynamicFunction")
const FunctionSource = require("../../Source/enum/Function")
const FunctionCall = require("../../Source/enum/FunctionCall")
const sools = require('../../../sools')
const Env = require('../../Env')
const Property = require('../../Source/enum/Property')

const getThisArg = (source) => {
  if (source instanceof Property) {
    return source.owner
  } else {
    return Env.global._handler
  }
}

const VirtualFunction = Virtual
  .define({
    name: 'function',
  })
  .virtual((Virtual) => {
    return class VirtualFunction extends sools.extends(Function, [Virtual()]) {

      static define(options) {
        const virtualFunction = super.define(options)
        virtualFunction.args = options.args || this.args
        virtualFunction.return = options.return || this.return
        return virtualFunction
      }

      call(...args) {
        const thisArg = getThisArg(this._handler.source)
        const scope = this._handler.scope.target
        args = args.map((arg) => arg && arg.virtual || arg)
        args = this._handler.buildArgs(scope, args)

        const handlers = [thisArg, ...args]
        handlers.reverse().forEach((arg) => {
          scope.processArg(arg);
        })

        const functionCall = new FunctionCall({
          scope,
          function: this._handler,
          args
        })

        scope.statements.push(functionCall)
        if (this._handler.return) {
          return this._handler.return.handler.build({
            source: functionCall,
            scope,
          })
        }
      }
    }
  })
  .proxy((Proxy) => {
    return class extends Proxy {
      apply(target, thisArg, args) {
        return target.call(...args)
      }
    }
  })
  .handler((Handler) => {
    return class Function extends Handler {

      constructor(options) {
        super(options)
        this.return = options.return || this.constructor.virtual.return
        this.args = options.args || this.constructor.virtual.args
      }

      buildArgs(scope, args) {
        args = [...args]
        var result = [];
        let descriptions = this.args || []
        for (let description of descriptions) {
          if (description.isVirtual) {
            description = {
              type: description
            }
          }
          if (!description.type) {
            throw new Error('Description has no type')
          }
          const arg = description.type.handler.buildArg({ fn: this, scope, args, description })
          if (arg) {
            result.push(arg._handler)
          }
        }
        return result;
      }

      static cast(args, fn) {
        return typeof (fn) == "function"
      }

      static parse(scope, args) {
        throw new Error("parse function trigger");
        return new this.virtual(scope, args)
      }

      static buildArg({ scope, args, fn, description }) {
        const arg = args.shift()
        const source = new DynamicFunction({
          scope,
          args: description.args,
          return: description.return,
          fn: arg,
          owner: fn,
        })
        return new this.virtual({
          scope,
          source,
        })
      }
    }
  })

FunctionSource.virtual = VirtualFunction
Virtual.Function = VirtualFunction
module.exports = VirtualFunction