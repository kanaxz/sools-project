const sools = require("sools");
const propertyTypes = require("sools-define/propertyTypes");
const Definition = require("sools-ui/Definition");
const Properties = require("sools-define/Properties");
const Panel = require("../Panel")
const UI = require("UI");
const associations = require("sools-data/associations");
const Association = require("sools-data/Association");
const Model = require("sools-data/Model");
const fields = require("../../../fields");
require("./index.scss");
module.exports = sools.define(Panel, (base) => {
    class ModelPanel extends base {
        constructor(model) {
            super(model.toString(), [{
                icon: 'trash-alt',
                action: function() {
                    this.model.delete();
                }
            },{
                icon: 'edit',
                action: function() {
                    this.edit();
                }
            }]);
            this.model = model;
            this.ui = this.model.constructor.definitions.get(UI);
            this.properties = this.model.constructor.properties.getByNames(this.ui.display);
        }

        edit(){

        }

        modelClicked(model) {
            this.showModel(model);
        }

        showModel(model) {
            if (model == this.currentModel)
                return;
            this.currentModel = model;
            this.show(new ModelPanel(model));
        }


        buildProperty(node, property) {
            node.appendChild(fields.build(this.model, property));
            if(property instanceof Association)
                node.classList.add("association");
            else
                node.classList.add("base")
        }
    }
    return ModelPanel
}, [
    new Properties({
        model: Model
    }, 'mode'),
    new Definition({
        name: "explorer-model",
        template: require("./index.html")
    })
])