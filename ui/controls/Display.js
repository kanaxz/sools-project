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
    addTemplate() {
      var result = htmlHelper.getElementFromTemplate(this.template);
      this.appendChild(result);
      this.loaded();

    }

    initialized() {
      super.initialized();
      this.update();
    }

    update() {
      this.clear();
      var beforeUpdateEvent = new CustomEvent("beforeUpdate", {
        bubbles: false,
        cancelable: true,
      })
      if (this.dispatchEvent(beforeUpdateEvent)) {
        this.addTemplate();
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

    propertyChanged(property) {
      this.update();
    }

    clear() {
      while (this.firstChild) {
        renderer.destroy(this.firstChild);
        this.removeChild(this.firstChild);
      }
    }
  }
},[
	new Properties('template','variables'),
	new Definition({
		name:'ui-display',
		inheritScope:true
	})
])

