var Control = require("../Control");
var htmlHelper = require("../html");
var renderer = require("../rendering/renderer");
class Display extends Control {

    addTemplate() {
        var result = htmlHelper.getElementFromTemplate(this.template);
        this.appendChild(result);
        this.loaded();

    }

    initialized(){
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

    propertyChanged(property){
        this.update();
    }

    clear() {
        while (this.firstChild) {
            renderer.destroy(this.firstChild);
            this.removeChild(this.firstChild);
        }
    }
}

Display
    .properties('template','variables')
    .define({
        name: "hdr-display",
        inheritScope: true
    })


module.exports = Display;