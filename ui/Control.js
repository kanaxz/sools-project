var renderer = require("./render/renderer");
var Scope = require("./render/Scope");
var BaseScope = require("./render/BaseScope");
var Base = require("sools/core/Base");
const BindableFunctions = require("sools/BindableFunctions");
const Propertiable = require("sools/Propertiable");
const Properties = require("sools/Propertiable/Properties");
const sools = require("sools");
const Definition = require("./Definition")

class temp extends HTMLElement {

}

module.exports = sools.define(Base.mixin(temp), [BindableFunctions(), Propertiable()], (base) => {

  class Control extends base {
    static define(args) {

      super.define(args);
      var definition = args.find((arg) => {
        return arg instanceof Definition
      });
      if (definition) {
        this.definition = definition;
        if (this.definition.name)
          customElements.define(this.definition.name, this);
      }


    }

    get definition() {
      return this.constructor.definition;
    }


    constructor() {
      super();
      this.isInitialized = false;
      this.isInitializing = false;
      this.parentScope = null;
      this.scope = new Scope(this);
      var constantes = this.constructor.definition.constantes
      if (constantes)
        this.scope.variables.set(constantes)
    }

    async processed(parentScope) {
    	if(!this.canInitialize())
    		return
      await this.attach(parentScope);
    }

    async attach(arg) {
      var parentScope;
      if (arg instanceof BaseScope)
        this.parentScope = arg;
      else if (arg instanceof Control)
        this.parentScope = arg.scope;
      else {
        throw new Error("Cannont retrieve scope");
      }
      await this.initialize();
    }


    canInitialize(){
    	return !this.isInitializing && !this.isInitialized
    }

    /**
        @protected
    */
    async initialize() {
      if (this.isInitializing || this.isInitialized){
      	debugger
        throw new Error();
      }
      this.isInitializing = true;
      await this.initializeContent()
      if (this.definition.template)
        await this.initializeTemplate();
      await this.initialized()

    }

    async initializeContent() {
      if (this.definition.transclude) {
        this.transcludeContent = [];
        this.childNodes.forEach((n) => {
          this.transcludeContent.push(n);
        })
        //return renderer.renderContent(this, this.parentScope)
      } else
        return await renderer.renderContent(this, this.scope)
    }

    async initializeTemplate() {
      if (!this.definition.template)
        throw new Error("The control '" + this.definition.name + "' hasn't a template");
      this.innerHTML = this.definition.template;
      await renderer.renderContent(this, this.scope)
      if (this.definition.transclude) {
        var container = this.transcule || this;
        this.transcludeContent.forEach((n) => {
          container.appendChild(n);
        })
        await renderer.renderContent(container, this.parentScope)
      }
      return null;
    }

    async initialized() {
      if (this.isInitialized == true || !this.isInitializing)
        throw new Error("Cannot initialize control");
      this.isInitializing = false;
      this.isInitialized = true;      
    }

    event(name, arg) {
      var event = new CustomEvent(name, {
        bubbles: true,
        'detail': arg
      });
      return this.dispatchEvent(event);
    }

    connectedCallback() {
    	
    }

    destroy() {
      renderer.destroy(this);
    }

    destructor() {
      for (var i = 0; i < this.childNodes.length; i++) {
        var childNode = this.childNodes[i];
        renderer.destroy(childNode);
      }
    }

    disconnectedCallback() {}
  }
  return Control;
}, [
  new Properties('isInitialized')
])