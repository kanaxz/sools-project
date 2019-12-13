const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools-define/Properties");
var Panel = require("../Panel")
require("./index.scss");
const UI = require("UI");
const ModelPanel = require("../Model");
const Models = require("sools-data/Models");
const Model = require("sools-data/Model");
module.exports = sools.define(Panel, (base) => {
    class Interface extends base {
        constructor(modelInterface) {
            super(modelInterface.name, [{
                icon: 'plus',
                action: function() {
                    this.createNewModel();
                }
            }]);
            this.modelInterface = modelInterface;
        }

        modelClicked(model){
            this.showModel(model);
        }

        showModel(model) {
            this.currentModel = model;
            this.show(new ModelPanel(model));
        }

        createNewModel() {
            this.currentModel = null;
            this.show(new ModelPanel(new this.modelInterface.modelType()));
        }


    }
    return Interface
}, [
    new Properties({
        currentModel: Model
    }),
    new Definition({
        name: "explorer-interface",
        template: require("./index.html")
    })
])