const operations = require("../operations");
const conditionMatcher = require("./conditionMatcher");
const includeExecutors = require("./includeExecutors");

var operationExecutors = [{
    type: operations.filter,
    execute: (scope, filter, results) => {
        return results.filter((result) => {
            return conditionMatcher.match(scope, filter.condition, result);
        })
    }
}, {
    type: operations.limit,
    execute: (scope, limit, results) => {
        return results.slice(0, limit.value);
    }
}, {
    type: operations.include,
    execute: (scope, include, results) => {
        includeExecutors.execute(scope, include, results)
        return results;
    }
}]

class Scope {
    constructor(options) {
        this.source = options.source;
        this.query = options.query;
        this.targetName = null;
    }

    target(targetName){
        if(!targetName)
            return this.targetName;
        if(this.targetName != null)
            this.targetName += "." + targetName;
        else
            this.targetName = targetName;
    }

}

operationExecutors.execute = function(scope, operation, results) {
    if (!scope instanceof Scope)
        scope = new Scope(scope);
    var executor = this.find((executor) => {
        return operation instanceof executor.type
    });
    if (!executor)
        throw new Error(`Operation executor not found for type '${operation.type.name}'`)
    return executor.execute(scope, operation, results);
}

module.exports = operationExecutors;