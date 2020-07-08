var Control = require("../Control");
var htmlHelper = require("../html");
var renderer = require("../render/renderer");
const sools = require("sools");
const Properties = require("sools/Propertiable/Properties")
const Definition = require("../Definition")
require("./Display.scss")
module.exports = sools.define(Control, (base) => {
  return class Display extends Control {
    constructor(template, variables) {
      super();
      this.template = template;
      this.variables = variables;
    }
    async addTemplate() {
      this.content = htmlHelper.getElementFromTemplate(this.template);
      this.appendChild(this.content);
      await this.loaded();
    }

    async initialized() {
      await super.initialized();
      await this.update();
    }

    async update() {
      this.clear();
      var beforeUpdateEvent = new CustomEvent("beforeUpdate", {
        bubbles: false,
        cancelable: true,
      })
      if (this.dispatchEvent(beforeUpdateEvent)) {
        await this.addTemplate();
      }
    }

    loaded() {
      var loadedEvent = new CustomEvent("loaded", {
        bubbles: false,
        cancelable: true,
      })
      if (this.dispatchEvent(loadedEvent)) {
        var scope = this.parentScope.child();
        scope.variables.set(this.variables);
        renderer.renderContent(this, scope)
      }
    }


    propertySet(...args) {
    	super.propertySet(...args);
    	if(this.isInitialized)
      	this.update();
    }

    clear() {
      while (this.firstChild) {
        renderer.destroy(this.firstChild);
        this.removeChild(this.firstChild);
      }
    }
  }

}, [
  new Properties('template','variables'),
  new Definition({
    name: 'ui-display',
    inheritScope: true
  })
])