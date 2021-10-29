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
    args: [
      Type,
      Virtual
    ]
  }),
  get: new Function({
    source: new Var('get'),
    return: Virtual,
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
    source: 'delete',
    args: [Virtual]
  }),
  assign: require("./Set"),
  return: require("./Return"),
  declare: require("./Declare"),
  instanceof: new Function({
    source: new Var('instanceof'),
    args: [Virtual, Virtual]
  }),
}

for (var fnName in functions) {
  global[fnName.toUpperCase()] = functions[fnName]
}

module.exports = functions;