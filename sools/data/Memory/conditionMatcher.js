const conditions = require("../conditions");
const Association = require("../Association");
const associations = require("../associations");

var conditionMatcher = [{
    type: conditions.and,
    execute: (modelType, and, obj) => {
        for (var condition of and) {
            if (!conditionMatcher.match(modelType, condition, obj))
                return false
        }
        return true;
    }
}, {
    type: conditions.equal,
    execute: (modelType, equal, obj) => {
        var property = modelType.properties.getByName(equal.propertyName);
        if (property instanceof associations.hasOne) {
            for (var propertyName in equal.value) {
                if (obj[equal.propertyName][propertyName] != equal.value[propertyName])
                    return false;
            }
            return true;
        } else {
            return obj[equal.propertyName] == equal.value;
        }
    }
}]

conditionMatcher.match = function(modelType, condition, obj) {
    var matcher = this.find((matcher) => {
        return condition instanceof matcher.type
    });
    if (!matcher)
        throw new Error(`Condition matcher not found for type '${condition.name}'`)
    return matcher.execute(modelType, condition, obj);
}

module.exports = conditionMatcher;