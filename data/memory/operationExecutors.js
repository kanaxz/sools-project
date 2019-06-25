const operations = require("../operations");
const conditionMatcher = require("./conditionMatcher");
const includeExecutors = require("./includeExecutors");

var operationExecutors = [{
    type: operations.filter,
    execute: (context, filter, results) => {
        return results.filter((result) => {
            return conditionMatcher.match(context, filter.condition, result);
        })
    }
}, {
    type: operations.limit,
    execute: (context, limit, results) => {
        return results.slice(0, limit.value);
    }
}, {
    type: operations.include,
    execute: (context, include, results) => {
        includeExecutors.execute(context, include, results)
        return results;
    }
}, {
    type: operations.target,
    execute: (context, target, results) => {
        if (target instanceof Queries.get)
            return results.map((result) => {
                return result[target.associationName];
            })
        else
            context.setTarget(target.associationName);
    }
}]

class Context {
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

operationExecutors.execute = function(context, operation, results) {
    if (!context instanceof Context)
        context = new Context(context);
    var executor = this.find((executor) => {
        return operation instanceof executor.type
    });
    if (!executor)
        throw new Error(`Operation executor not found for type '${operation.type.name}'`)
    return executor.execute(context, operation, results);
}

module.exports = operationExecutors;