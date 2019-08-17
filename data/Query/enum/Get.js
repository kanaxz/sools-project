const sools = require("sools");

const Properties = require("sools-define/Properties");

const Type = require("../Type");
const Query = require("../index");
const Model = require("../../Model");
const Models = Array.of(Model);
const OperationsEnum = require("../Operation/enum");

module.exports = sools.define(Query, [
    OperationsEnum.include.behavior(),
    OperationsEnum.filter.behavior(),
    OperationsEnum.limit.behavior(),
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
    new Type('get')
])