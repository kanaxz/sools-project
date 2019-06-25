const sools = require("sools");

const Properties = require("sools-define/Properties");

const QueryType = require("../QueryType");
const Query = require("../Query");
const Models = require("../Models");
const Includeable = require("../mixins/Includeable");
const Filterable = require("../mixins/Filterable");
const Transformable = require("../mixins/Transformable");
const Limitable = require("../mixins/Limitable");

module.exports = sools.define(Query, [
    Includeable(),
    Filterable(),
    Transformable(),
    Limitable()
], (base) => {
    class GetQuery extends base {

        setResult(modelInterfaces, result, options) {
            var type = this.modelType.class;
            var modelInterface = modelInterfaces.get(type);
            this.result = this.processResult(modelInterface, result, (results) => {
                return modelInterface.modelsFactory.build(Models, results.map((result) => {
                    var model = type.build(result, options);
                    model.attach(modelInterface);
                    return model;
                }));
            })
        }

        resultToJSON() {
            return super.resultToJSON(this.modelType.class, this.result)
        }
    }
    return GetQuery;
}, [
    new QueryType('get')
])