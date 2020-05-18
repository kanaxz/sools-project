const Env = require("../virtualizing/Env")
const VScope = require("../virtualizing/Scope")
const Virtualizing = require("../virtualizing");
const Flow = require("../processing/Flow")
const Model = require("./Model")
const HandlerOptions = require("../virtualizing/Handler/Options")
const Scope = require("../processing/Scope")
const Context = require("./Context");
const Virtuals = require("./virtualizing/Virtual/enum/")
const Sources = require("../virtualizing/Source/enum/")
const Virtual = require("../virtualizing/Virtual/")
const Data = require("./index")

function getVirtual(arg, name) {
  if (arg instanceof Array) {
    return Virtuals.array.of(getVirtual(arg[0], name.substring(0, name.length - 1)))
  } else if (typeof(arg) == "object") {
    var properties = {}
    for (var p in arg) {
      properties[p] = getVirtual(arg[p], p)
    }
    return Virtual.define({
      name,
      extends: Virtuals.object,
      properties
    });
  } else if (typeof(arg) == "string")
    return Virtuals.string
  else if (typeof(arg) == "number")
    return Virtuals.number
  throw new Error("Type not found");
}

module.exports = class Datas extends Flow {
  constructor(options) {
    super();
    this.init = options.init;
    this.models = options.models;
    this.source = options.source;
    this.constantes = options.constantes;
    this.executor = options.executor;
    this.context = Data.defineType({
      extends: Context
    });
    var virtuals = Object.keys(this.models).reduce((result, modelName) => {
      result[modelName] = this.models[modelName].virtual
      return result
    }, {})
    var types = {
      Virtual,
      ...virtuals,
      ...Virtuals,
    }
    delete types.context
    this.env = new Env({
      workers: options.virtualization,
      types,
      initFn: ($) => {
        var context = new this.context.virtual(new HandlerOptions({
          source: new Sources.var('context'),
          scope: $._private
        }))
      }
    })
    var properties = {};
    for (let modelName in this.models) {
      let model = this.models[modelName];
      properties[model.pluralName] = {
        type: Virtuals.collection.of(model.virtual)
      }
    }
    this.vDatas = Virtualizing.defineType({
      name: 'datas',
      extends: Virtuals.datas,
      properties
    })
    this.context.virtual.registerProperties({
      db: this.vDatas,
      constantes: getVirtual(options.constantes, "constantes")
    })
  }

  async setup(scope, next) {

    scope.datas = this;
    if (!next)
      next = () => {}
    return super.setup(scope, next);
  }

  build(json) {
    return this.env.process((context, $) => {
      if (this.init)
        this.init(context, $)
      var scope = $._private
      this.env.build(scope, json)
    })
  }
  process(fn) {
    return this.env.process((context, $) => {
      if (this.init)
        this.init(context, $)
      return fn(context, $)
    })
  }

  async execute(arg1, arg2) {	
    if (arg1 instanceof Context.type) {
      var vscope = this.process(arg2)
      var scope = new Scope();
      scope.vars = {
      	context:arg1
      }
      scope.scope = vscope;
      scope.context.constantes = this.constantes
      await super.execute(scope, () => {});
      return scope.result
    } else {
      arg1.context.constantes = this.constantes
      await super.execute(arg1, arg2)
    }
  }
}