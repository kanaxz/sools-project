const Virtual = require("../Virtual");
const Error = require('../Virtual/enum/Error')
const Boolean = require("../Virtual/enum/Boolean")
const Function = require("../Virtual/enum/Function")
const Array = require("../Virtual/enum/Array")
const Number = require("../Virtual/enum/Number")
const String = require("../Virtual/enum/String")
const Object = require("../Virtual/enum/Object")
const Type = require("../Virtual/enum/Type");
const Property = require("../Source/enum/Property")
const Var = require('../Source/enum/Var')

const functions = {
  or: new Function({
    source: new Var('or'),
    return: Virtual,
    args: [{
      type: Array.of(Virtual),
      spread: true
    }]
  }),
  cast: new Function({
    source: new Var('cast'),
    /*
    return: (source) => {
      return new functionCall.args[0].source({
        source
      })
    },
    /**/
    args: [
      Type,
      Virtual
    ]
  }),
  get: new Function({
    source: new Var('get'),
    return: Virtual,
    /*
    return: (functionCall) => {
      return new Virtual({
        source: functionCall
      })
    },
    /**/
    args: [
      Virtual,
      String
    ]
  }),
  forIn: new Function({
    source: new Var('forin'),
    args: [Virtual, {
      type: Function,
      required: true,
      args: [Virtual],
      /*
      args: (scope, thisArg, args, [source]) => {
        return [new String({
          scope,
          source
        })]
      }
      /**/
    }]
  }),
  throw: new Function({
    source: new Var('throw'),
    args: [Error]
  }),
  not: new Function({
    source: new Var('not'),
    args: [Virtual],
    return: Boolean,
    /*
    return: (functionCall) => {
      return new Boolean({
        source: functionCall
      })
    },
    /**/
  }),
  log: new Function({
    source: new Var('log'),
    args: [Array.of(Virtual)]
  }),
  if: new Function({
    source: 'if',
    args: [Virtual, {
      type: Function,
      required: true
    }]
  }),
  elseif: new Function({
    source: 'elseif',
    args: [Virtual, {
      type: Function,
      required: true
    }]
  }),
  else: new Function({
    source: 'else',
    args: [{
      type: Function,
      required: true
    }]
  }),
  delete: new Function({
    jsCall: (args, call) => {
      if (args.length == 1) {
        if (!(args[0]._handler.source instanceof Property))
          throw new Error();
        args = [
          args[0]._handler.source.source,
          args[0]._handler.source.path
        ]
      }
      return call(...args)
    },
    source: 'delete',
    args: [Virtual, String]
  }),
  assign: require("./Set"),
  return: require("./Return"),
  declare: require("./Declare"),
  instanceof: new Function({
    source: new Var('instanceof'),
    args: [Virtual, Virtual]
  }),
  findByUpperCase(name) {
    for (var fn in this)
      if (fn.toUpperCase() == name)
        return this[fn];
  }
}

for (var fnName in functions) {
  global[fnName.toUpperCase()] = functions[fnName]
}

module.exports = functions;