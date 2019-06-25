const Process = require("sools-process/Process");
const Store = require("./Store");
const Storable = require("./Storable");
const Storables = require("./Storables");
const ModelInterfaces = require("../ModelInterfaces");
const ModelInterface = require("../ModelInterface");
const Query = require("../Query");
const Queries = require("../Queries");
const memoryQueryExecutors = require("../memory/queryExecutors");
const associations = require("../associations");
require("./PropertyHandlers");

class Stores extends Process {

    constructor() {
        super();
        this.stores = [];
    }

    setup(context, next) {
        var modelInterfaces = context.get(ModelInterfaces);
        modelInterfaces.forEach((modelInterface) => {
            var dependencies = modelInterface.modelType.dependencies
            if (dependencies.has(Storable)) {
                var store = new Store(modelInterface.modelType)
                this.stores.push(store);
                modelInterface.components.push(store);
                modelInterface.modelsFactory.dependencies.push(Storables(store))
            }
        })
        return next();
    }

    get(modelType) {
        return this.stores.find((store) => {
            return store.type.type == modelType;
        })
    }

    execute(context, next) {
        var modelInterfaces = context.get(ModelInterfaces);
        modelInterfaces.forEach((modelInterface) => {
            var dependencies = modelInterface.modelType.dependencies
            if (dependencies.has(Storable)) {
                context.push(modelInterface.components.get(Store));
            }
        })
        return next()
            .then(() => {
                var queries = context.getAll(Query);
                queries.forEach((query) => {
                    var modelInterface = query.components.get(ModelInterface);
                    var modelType = modelInterface.modelType;
                    if (modelType.dependencies.has(Storable)) {
                        var store = modelInterface.components.get(Store);
                        if (query instanceof Queries.delete) {
                            var get = new Queries.get(query.modelType);
                            get.operations = query.operations;
                            var results =  memoryQueryExecutors.execute(this, get);

                            for (var property of query.modelType.class.properties) {
                                if (property instanceof associations.hasManyThrough) {
                                    if (property.onDelete) {
                                        if (property.onDelete == associations.dispatch.cascade) {
                                            for (var result of results) {
                                                
                                            }
                                        }
                                    }
                                }
                            }

                            for (var result of results) {
                                store.remove(result);
                            }

                            this.stores.forEach((store) => {
                                for (var storables of store.storablesArray) {
                                    this.handleStorablesDelete(storables, query);
                                }
                            })
                        }
                    }

                })
            })
    }

    handleDelete(storables, query) {

    }
}

module.exports = Stores;