const Property = require("./Source/enum/Property")
const Var = require("./Source/enum/Var")
const GlobalScope = require('./GlobalScope')
//console.log(GlobalScope)
//const Global = require('../Global')
//const Virtual = require("../Virtual")

var id = 0;
class Handler {
  constructor(options) {
    this.id = id++
    this.virtual = options.virtual;
    if (!this.virtual) {
      debugger
      throw new Error()
    }
    this.source = options.source
    if (!this.source) {
      debugger
      throw new Error();
    }
    this.typeName = this.virtual.constructor.typeName

    this.scope = options.scope || GlobalScope.target
    if (this.source instanceof Var) {
      this.scope.vars.push(this);
    }
  }

  get template() {
    return this.constructor.template;
  }

  static get template() {
    return this.virtual.template
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
      source: this,
      path: property.name
    })
    if (!property.type) {
      throw new Erorr('')
    }
    const args = property.type.handler.callAsProperty(this, property)
    //this.scope.processArg(this)
    const virtual = new property.type({
      source,
      scope: this.scope,
      ...args
    })

    return virtual;
  }

  static callAsProperty() {
    return {};
  }

  static buildArg({ scope, args, description }) {
    let arg = args.shift()
    if (arg == null && description.required) {
      throw new Error()
    }
    if (!(arg instanceof description.type)) {
      arg = this.parse(scope, arg)
    }
    return arg
  }

  static parse(scope, value) {
    return new this.virtual({
      scope,
      source: new Value(value)
    })
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
  /*
    static build(scope,arg){
      return new this(scope,arg);
    }
  /**/

}




/**/
module.exports = Handler;