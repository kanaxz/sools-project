const stringUtils = require("../../string/utils")

const Property = require("../Source/enum/Property")
const Method = require("../Source/enum/Method")
const HandlerOptions = require("../Handler/Options")
const Handler = require("../Handler")
var caches = [];
const VirtualProxy = require("../Proxy")

class Virtual {
  constructor(arg) {
    var options
    if (!(arg instanceof HandlerOptions))
      options = new HandlerOptions({
        source: arg
      })
    else
      options = arg;
    options.virtual = this;
    Object.defineProperty(this, '_handler', {
      enumerable: false,
      writable: true,
      value: new this.constructor.handler(options)
    })
  }

  get template() {
    return this.constructor.template
  }

  static of (template) {
    if (!this.template || !template || (!(template.prototype instanceof Virtual) && template != Virtual)) {
      debugger
      throw new Error("Not template type")
    }
    /*
    if(typeof(template) == "function"){
    	if(!(template.prototype instanceof this.template)){
    		throw new Error("No");
    	}
    }
    /**/
    var cache = caches.find((cache) => {
      return cache.template == template && cache.extends == this
    })
    if (!cache) {
      cache = Virtual.define({
        extends: this,
        template,
        name: `${this.typeName}<${template.typeName}>`
      })
      caches.push(cache)
    }
    return cache
  }

  static defineType(description) {
    return this.define(description)
  }

  static define(typeDescription) {
    var base = typeDescription.extends && typeDescription.extends.target || Virtual;
    var baseProxy = typeDescription.extends && typeDescription.extends.proxy || VirtualProxy;
    var holder = {}
    var type = (typeDescription.class && typeDescription.class(base)) || (class extends base {})
    var proxyClass = (typeDescription.proxy && typeDescription.proxy(baseProxy)) || (class extends baseProxy {})
    //var proxy = type;

    var proxy = new Proxy(type, {
      construct(target, args) {
        var instance = new type(...args);
        return new Proxy(instance, new proxyClass())
      }
    })
    /**/
    proxy.registerMethods(typeDescription.methods);
    proxy.registerProperties(typeDescription.properties);

    proxy.handler = typeDescription.handler || (typeDescription.extends && class extends typeDescription.extends.handler {}) || class extends Handler {};
    proxy.typeName = typeDescription.name
    if (typeDescription.template)
      proxy.template = typeDescription.template
    proxy.target = type;
    proxy.proxy = proxyClass;
    proxy.extends = typeDescription.extends;
    proxy.handler.virtual = proxy;
    return proxy
  }


  static registerMethods(methods) {
    this.methods = { ...this.methods }
    if (!methods)
      return
    if (typeof(methods) == "function")
      methods = methods(this)
    for (let methodName in methods) {

      let method = methods[methodName]
      if (method === false) {
        this.prototype[methodName] = function() {
          throw new Error();
        }
        this.methods[method.name] = null;
        continue
      }
      method = new Method({
        ...method,
        name: methodName,
        type: this
      })

      this.prototype[method.name] = function(...args) {
        args.unshift(this)
        return method.call(this._handler.scope.target, args)
      }
      this.methods[method.name] = method;
    }
  }

  static registerProperties(properties) {
    this.properties = { ...this.properties }
    for (let propertyName in properties) {
      let property = properties[propertyName];
      if (typeof(property) != "object") {
        property = {
          type: property
        }
      }
      property.name = propertyName;
      property.ownerType = this;
      Object.defineProperty(this.prototype, propertyName, {
        get: function(p) {
          return this._handler.getProperty(property);
        },
        set: function(value) {
          return this._handler.setProperty(property, value);
        }
      })
      this.properties[propertyName] = property;
    }
  }

  toJSON() {
    return this._handler.toJSON()
  }


};

Virtual.registerMethods({
  eq: {
    return: (functionCall) => {
      return new Virtual.boolean(new HandlerOptions({ source: functionCall }))
    },
    args: (T) => [
      T,
      T
    ]
  }
})

Virtual.handler = Handler;
Handler.virtual = Virtual;
Virtual.typeName = "Virtual";
module.exports = Virtual;