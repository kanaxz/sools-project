const sools = require("sools");

const Operation = require("../../Operation");
const OperationType = require("../../OperationType");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");
const Includeable = require("./Mixin");
const associations = require("../../associations");
var Include = sools.define(Operation, [Includeable()], (base) => {
    class Include extends base {
        constructor(propertyName) {
            super();
            this.propertyName = propertyName;
        }

        resultToJSON(type, results, next) {
            var property = type.properties.getByName(this.propertyName);
            var jsonResults = next(results);
            jsonResults.forEach((jsonResult, index) => {
                var result = results[index][this.propertyName];
                if (property instanceof associations.hasOne)
                    jsonResult[this.propertyName] = results[index][this.propertyName].toJSON()
                else
                    jsonResult[this.propertyName] = super.resultToJSON(property.type, result);
            })

            return jsonResults;
        }
    }

    return Include;
}, [
    new OperationType('include'),
    new Properties({
        propertyName: Properties.types.string()
    })
])

Includeable.include = Include;
module.exports = Include;