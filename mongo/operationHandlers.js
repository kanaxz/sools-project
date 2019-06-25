const operations = require("sools-data/operations");
const conditionBuilders = require("./conditionBuilders");
const associationHandlers = require("./associationHandlers");
const includeHelper = require("./includeHelper");
const Association = require("sools-data/Association");
var operationHandlers = [{
    type: operations.root,
    handle: function(interface, modelType, root, pipeline) {
        pipeline.push({
            $replaceRoot: {
                newRoot: "$" + root.associationName
            }
        })
    }
}, {
    type: operations.limit,
    handle: function(interface, modelType, limit, pipeline) {
        pipeline.push({
            $limit: limit.value
        })
    }
}, {
    type: operations.filter,
    handle: function(interface, modelType, filter, pipeline) {
        var match = conditionBuilders.build(modelType, filter.condition)
        pipeline.push({
            $match: match
        })
    }
}, {
    type: operations.include,
    handle: function(interface, modelType, include, pipeline) {
        associationHandlers.handle(interface, modelType, include, pipeline)
    }
}]

operationHandlers.handle = function(interface, modelType, operation, pipeline) {
    var handler = this.find((operationHandler) => {
        return operation instanceof operationHandler.type;
    })
    if (!handler)
        throw new Error(`Could not find handle for operation ${operation.constructor.name}`)
    handler.handle(interface, modelType, operation, pipeline)
}

associationHandlers.operationHandlers = operationHandlers;

module.exports = operationHandlers;