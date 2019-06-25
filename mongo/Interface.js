var mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const Queries = require("sools-data/Queries");
const stringUtils = require("sools/string/utils");
const operationHandlers = require("./operationHandlers");
const ModelType = require("sools-data/ModelType");
class Interface {
    constructor(url, dbName) {
        this.url = url;
        this.dbName = dbName;
        this.client = null;
        this.db = null;
    }

    buildCollection(modelType) {

    }

    start() {
        this.client = new MongoClient(this.url);
        return this.client.connect().then(() => {
            this.db = this.client.db(this.dbName);
        }).catch((err) => {
            console.error(err);
            return this.stop();
        })
    }

    stop() {
        return this.client.close();
    }

    getModelCollectionDefinition(modelType) {
        if (modelType instanceof ModelType)
            modelType = modelType.class;

        return {
            name: stringUtils.plural(modelType.type.name)
        }
    }


    buildPipeline(query) {
        var pipeline = [];
        for (var operation of query.operations) {
            operationHandlers.handle(this, query.modelType.class, operation, pipeline);
        }
        return pipeline;
    }

    get(query) {
        var collectionDefinition = this.getModelCollectionDefinition(query.modelType);
        var collection = this.db.collection(collectionDefinition.name);
        return new Promise((resolve, reject) => {
            var pipeline = this.buildPipeline(query);
            var cursor = collection.aggregate(pipeline);


            var result = [];
            cursor.on("data", function(data) {
                result.push(data);
            })

            cursor.on("error", (err) => {
                reject(err);
            })

            cursor.on("end", (err) => {
                resolve(result);
            })
        }).then((results) => {
            console.log(results)
            return results
        })
    }

    delete(query) {
        var collectionDefinition = this.getModelCollectionDefinition(query.modelType);
        var collection = this.db.collection(collectionDefinition.name);
        return this.get(query)
            .then((models) => {
                var ids = models.map((model) => {
                    return {_id:model._id};
                });
                return collection.deleteMany({
                    $or: ids
                })
            })
    }

    add(query) {
        var collectionDefinition = this.getModelCollectionDefinition(query.modelType);
        var collection = this.db.collection(collectionDefinition.name);
        return collection.insert(query.values).then((result) => {
            if (query.values instanceof Array)
                return result.ops;
            else
                return result.ops[0];
        })
    }

    query(query) {
        if (query instanceof Queries.get)
            return this.get(query);
        if (query instanceof Queries.add)
            return this.add(query);
        if (query instanceof Queries.delete)
            return this.delete(query);
        else
            throw new Error(`Query type '${query.constructor.type.name}' not supported`)
    }
}

module.exports = Interface;