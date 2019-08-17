const sools = require("sools");

const Operation = require("../../index");
const Type = require("../../Type");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");
const Behavior = require("./Behavior");
const AssociationsEnum = require("../../../../Model/Association/Enum");
var Include = sools.define(Operation, [Behavior()], (base) => {
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
                if (property instanceof AssociationsEnum.hasOne)
                    jsonResult[this.propertyName] = results[index][this.propertyName].toJSON()
                else
                    jsonResult[this.propertyName] = super.resultToJSON(property.type, result);
            })

            return jsonResults;
        }
    }
    Include.behavior = Behavior;
    return Include;
}, [
    new Type('include'),
    new Properties({
        propertyName: Properties.types.string()
    })
])

module.exports = Include;