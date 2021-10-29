const stringUtils = require("../../string/utils")
const Scope = require('../Scope')
const Handler = require("../Handler")
const VirtualProxy = require("../Proxy")
const sools = require('../../sools')

var caches = []

const areTemplatesMatching = (templates1, templates2) => {
  if (templates1.length !== templates2.length) {
    return false
  }
  for (let i = 0; i < templates1.length; i++) {
    const template1 = templates1[i]
    const template2 = templates2[i]

    if (template1 !== template2) {
      return false
    }
  }
  return true
}

const Virtual = sools.proxy((base) => {

  return class extends base {
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

    get templates() {
      return this.constructor.templates
    }

    static of(...templates) {
      for (const template of templates) {
        if (!template || (template && !template.isVirtual && template != Virtual)) {
          throw new Error("Not template type")
        }
      }

      var cache = caches.find((cache) => {
        return areTemplatesMatching(cache.templates, templates) && cache.extends == this
      })
      if (!cache) {
        cache = this.define({
          templates,
          isOf: true,
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
      proxy.methods(typeDescription.methods)
      proxy.properties(typeDescription.properties)

      proxy.handler = typeDescription.handler || (extend && class extends extend.handler { }) || class extends Handler { }


      proxy.templates = []
      if (typeDescription.template)
        proxy.templates = [typeDescription.template]
      if (typeDescription.templates) {
        proxy.templates = typeDescription.templates
      }
      proxy.baseName = typeDescription.name || extend.baseName
      proxy.typeName = proxy.baseName
      if (proxy.templates.length) {
        proxy.typeName += `<${proxy.templates.map((template) => { return template.typeName }).join(', ')}>`
      }
      for (const template of proxy.templates) {
        if (template.prototype instanceof Virtual.Template) {
          template.link(proxy)
        }
      }

      proxy.target = type
      proxy.proxy = proxyClass
      proxy.extends = typeDescription.extends
      proxy.handler.virtual = proxy
      //console.log(typeDescription.name, proxy.handler.name)
      return proxy
    }


    static methods(methods) {

      for (const methodName in methods) {
        methods[methodName] = Virtual.Function.define({
          ...methods[methodName],
          readonly: true
        })
      }
      this.properties(methods)
    }

    static properties(properties) {
      if (!properties) {
        return this._properties
      }
      this._properties = { ...this._properties }
      for (let propertyName in properties) {
        let property = properties[propertyName];
        if (typeof (property) != "object") {
          property = {
            type: property
          }
        }
        if (!property.type) {
          throw new Error(`Property ${propertyName} has no type`)
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
        this._properties[propertyName] = property;
      }
    }

    instanceof(type) {
      return this instanceof type || type === Virtual
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