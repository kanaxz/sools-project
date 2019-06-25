const conditions = require("sools-data/conditions");
const ObjectID = require('mongodb').ObjectID;
const ObjectIdProperty = require("./ObjectIdProperty");
const associations = require("sools-data/associations");
var conditionBuilders = [{
    type: conditions.and,
    build: (modelType, and) => {
        var result = [];
        for (var condition of and) {
            result.push(conditionBuilders.build(modelType, condition));
        }
        return {
            $and: result
        }
    }
}, {
    type: conditions.equal,
    build: (modelType, equal) => {

        var property = modelType.properties.getByName(equal.propertyName);
        var value;
        if (property instanceof associations.hasOne) {
            var type = property.type;
            var value = {};
            for (var propertyName in equal.value) {
                var subProperty = type.properties.getByName(propertyName);
                var subValue = equal.value[propertyName];
                if (subProperty instanceof ObjectIdProperty) {
                    subValue = ObjectID(subValue);
                }
                value[propertyName] = subValue;

            }
        } else {
            if (property instanceof ObjectIdProperty) {
                value = ObjectID(equal.value);
            } else
                value = equal.value
        }
        return {
            [equal.propertyName]: value
        }
    }
}, {
    type: conditions.like,
    build: (modelType, like) => {
        return {
            [like.propertyName]: new RegExp('.*' + like.value + '.*')
        }
    }
}]

conditionBuilders.build = function(modelType, condition) {
    var builder = this.find((builder) => {
        return condition instanceof builder.type
    });
    if (!builder) {

        throw new Error(`Builder not found for condition type '${condition.constructor.name}'`)
    }
    return builder.build(modelType, condition);

}

module.exports = conditionBuilders;