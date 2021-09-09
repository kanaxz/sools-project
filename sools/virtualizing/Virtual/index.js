const stringUtils = require("../../string/utils")
const Scope = require('../Scope')
const Handler = require("../Handler")
var caches = [];
const VirtualProxy = require("../Proxy")
const sools = require('../../sools')

const Virtual = sools.proxy((base) => {

  return class Virtual extends base {
    static isVirtual = true
    constructor(options) {
      super()
      options.virtual = this
      Object.defineProperty(this, '_handler', {
        enumerable: false,
        writable: true,
        value: new this.constructor.handler(options)
      })
    }

    get template() {
      return this.constructor.template
    }

    static of(template) {
      if (!this.template || !template || (!template.isVirtual && template != Virtual)) {
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
        cache = this.define({
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
      const extend = typeDescription.extends || this
      const base = extend.target || extend
      const baseProxy = extend && extend.proxy || VirtualProxy;

      const type = (typeDescription.class && typeDescription.class(base)) || (class extends base { })
      const proxyClass = (typeDescription.proxy && typeDescription.proxy(baseProxy)) || (class extends baseProxy { })
      //var proxy = type;

      const proxy = new Proxy(type, {
        construct(target, args) {
          const instance = new type(...args)
          return new Proxy(instance, new proxyClass())
        }
      })
      /**/
      proxy.registerMethods(typeDescription.methods)
      proxy.registerProperties(typeDescription.properties)

      proxy.handler = typeDescription.handler || (extend && class extends extend.handler { }) || class extends Handler { }
      proxy.typeName = typeDescription.name
      if (typeDescription.template)
        proxy.template = typeDescription.template
      proxy.target = type;
      proxy.proxy = proxyClass
      proxy.extends = typeDescription.extends
      proxy.handler.virtual = proxy
      //console.log(typeDescription.name, proxy.handler.name)
      return proxy
    }


    static registerMethods(methods) {

      for (const methodName in methods) {
        methods[methodName].type = Virtual.Function
      }
      this.registerProperties(methods)
    }

    static registerProperties(properties) {
      this.properties = { ...this.properties }
      for (let propertyName in properties) {
        let property = properties[propertyName];
        if (typeof (property) != "object") {
          property = {
            type: property
          }
        }
        property.name = propertyName;
        property.ownerType = this;
        Object.defineProperty(this.prototype, propertyName, {
          get: function (p) {
            return this._handler.getProperty(property);
          },
          set: function (value) {
            return this._handler.setProperty(property, value);
          }
        })
        this.properties[propertyName] = property;
      }
    }

    toJSON() {
      return this._handler.toJSON()
    }


  }
})

Virtual.handler = Handler;
Handler.virtual = Virtual;
Virtual.typeName = "Virtual";
Scope.Virtual = Virtual
module.exports = Virtual;