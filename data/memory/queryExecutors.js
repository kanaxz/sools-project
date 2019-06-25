const Queries = require("../Queries");
const operationExecutors = require("./operationExecutors");
const Association = require("../Association");
const associations = require("../associations");
var queryExecutors = [{
    type: Queries.get,
    execute: (source, query) => {
        var results = source.get(query.modelType);
        for (var operation of query.operations) {
            results = operationExecutors.execute({
                source,
                query
            }, operation, results);
        }
        return results;

    }
}, {
    type: Queries.delete,
    execute: (source, query) => {
        var sourceResults = source.get(query.modelType);
        var results = sourceResults;
        for (var operation of query.operations) {
            results = operationExecutors.execute({
                source,
                query
            }, operation, results);
        }

        for (var property of query.modelType.class.properties) {
            if (property instanceof Association) {
                if (property.onDelete) {
                    if (property.onDelete == associations.dispatch.cascade) {
                        if (property instanceof associations.hasManyThrough) {
                            for (var result of results) {
                                var cascadeQuery = new Queries.delete(property.through.type)
                                    .where({
                                        [property.through.this]: query.modelType.class.identity(result)
                                    })
                                queryExecutors.execute(source, cascadeQuery);
                            }
                        }
                    }
                }
            }
        }
        for (var result of results) {
            var index = sourceResults.indexOf(result);
            sourceResults.splice(index, 1);
        }
        return results.length;
    }
}]

queryExecutors.execute = function(source, query) {
    var executor = this.find((executor) => {
        return query instanceof executor.type
    });
    if (!executor)
        throw new Error(`query executor not found for type '${query.name}'`)
    return executor.execute(source, query);
}

module.exports = queryExecutors;