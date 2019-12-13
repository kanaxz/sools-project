const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools-define/Properties");
const Control = require("sools-ui/Control");
const Models = require("sools-data/Models");
const UI = require("UI");
const Op = require("sools-data/conditions");
require("./index.scss");

module.exports = sools.define(Control, (base) => {
    class Models extends base {


        initialize() {
            this.ui = this.source.modelType.definitions.get(UI);
            return this.ui.controls.simple()
                .then((simpleType) => {
                    this.simpleType = simpleType;
                    return this.refresh();
                })
                .then(() => {
                    return super.initialize();
                })
        }

        filter(value) {
            this.filterValue = value;
            this.refresh();
        }

        buildSimpleControl(model){
            return new this.simpleType(model)
        }

        refresh() {
            var query = this.source.get()

            if (this.filterValue) {
                query.where({
                    [this.ui.defaultProperty]: Op.like(this.filterValue)
                })
            }
            this.querying = true;
            return query.then((models) => {
                this.querying = false;
                console.log("models", models)
                this.models = models;
            })
        }
    }
    return Models
}, [
    new Properties('querying', {
        models: Models
    }),
    new Definition({
        name: "datas-models",
        template: require("./index.html")
    })
])