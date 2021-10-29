const Property = require("./Source/enum/Property")
const Var = require("./Source/enum/Var")
const GlobalScope = require('./GlobalScope')
const Value = require('./Source/enum/Value')

module.exports = class Handler {
  constructor(options) {
    this.virtual = options.virtual;
    if (!this.virtual) {
      throw new Error()
    }
    this.source = options.source
    if (!this.source) {
      throw new Error();
    }
    this.typeName = this.virtual.constructor.typeName

    this.scope = options.scope || GlobalScope.target
    if (this.source instanceof Var) {
      this.scope.vars.push(this);
    }
  }

  get templates() {
    return this.constructor.templates;
  }

  static get templates() {
    return this.virtual.templates
  }

  clone(options) {
    options = options || {}
    if (!options.source)
      options.source = this.source;
    if (!options.scope) {
      if (options.source && options.source.scope)
        options.scope = options.source.scope
      else
        options.scope = this.scope;
    }

    return new (this.cloneConstructor())(options);
  }

  cloneConstructor() {
    return this.constructor.virtual;
  }

  setProperty(property, value) {
    Handler.set.call(this.scope, [this, property.name, value])
  }

  getProperty(property) {
    const source = new Property({
      owner: this,
      path: property.name
    })
    if (!property.type) {
      throw new Erorr('')
    }

    const virtual = property.type.handler.build({
      source,
      scope: this.scope,
    })

    return virtual;
  }

  static buildArg(options) {
    const { scope, args, description } = options
    const arg = args.shift()
    if (arg.constructor.isVirtual)
      return arg

    return this.build({
      source: this.parseToSource({ arg, ...options }),
      scope
    })
  }

  static parseToSource({ arg }) {
    return new Value(arg)
  }

  static build(options) {
    let type = this.virtual

    const virtuals = Handler.Template.getVirtuals(this.templates, options.source)
    if (virtuals) {
      type = type.of(...virtuals)
    }

    return new type(options)
  }


  toJSON() {
    if (!this.source) {
      debugger
      throw new Error()
    }
    if (this.source.toJSON) {
      return this.source.toJSON()
    }
    else {
      return this.source
    }
  }

  static cast(arg) {
    return false
  }

}

