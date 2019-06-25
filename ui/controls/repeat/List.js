var html = require("../../html");
var BaseRepeater = require("./BaseRepeater")
const sools = require("sools");
const Properties = require("sools-define/Properties");
const Definition = require("../../Definition")
module.exports = sools.define(BaseRepeater, (base) => {
    class List extends base {

        canBuild() {
            return this.template && super.canBuild();
        }

        buildElement(it) {
            var templateType = typeof(this.template);
            var element = null;
            switch (templateType) {
                // template is control class
                case "function":
                    var result = this.template(it.object);
                    if (html.isTemplate(result)) {
                        element = html.getElementFromTemplate(result);
                    } else if (result instanceof HTMLElement)
                        element = result;
                    else
                        throw new Error("Unknow template type")
                    break;
                case "object":
                    element = html.getElementFromTemplate(this.template);
                    break;
                default:
                    throw new Error("Unknow template type");
            }
            it.element = element
        }

        getElementsContainer() {
            return this.container || this;
        }

        destructor() {
            super.destructor();
            this.template = null;
        }
    }

    return List;
}, [
    new Properties({
        template: Properties.types.any({
            onSet: function() {
                if (this.itemTemplate && this.template.parentNode == this)
                    this.removeChild(this.template);
                this.refresh();
            }
        })
    }),
    new Definition({
        name: 'ui-list'
    })
])