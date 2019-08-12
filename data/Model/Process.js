const sools = require("sools");
const Componentable = require("sools-define/Componentable");
const Store = require("./storing/Store");
const Process = require("sools-process/Process");
const Factory = require("sools/Factory");
const sools = require("sools");
const Flow = require("sools-process/Flow");
const Segment = require("sools-process/Segment");
const Scope = require("sools-process/Scope");
const Query = require("./Query");
const stringUtils = require("sools/string/utils");
const ModelInterface = require("../Interface");
const Queries = require("./Queries");
const Array = require("sools-define/Array");
const Models = require("./Models")
const Model = require("./Model");

module.exports = sools.define(Flow, [Array()], (base) => {

    class ModelInterfaces extends base {
        constructor(modelTypes) {
            super();
            this.modelTypes = modelTypes;
            this.modelInterfaces = [];
            this.build();
        }

        get(modelType) {
            return this.find((modelInterface) => {
                return modelInterface.modelType == modelType;
            })
        }

        build() {
            var self = this;
            this.modelTypes.forEach((modelType) => {
                var modelInterface = {type:modelType,modelsFactory:new Factory()};

                for (let queryType of Queries) {
                    modelInterface[queryType.type.name] = (...args) => {
                        var query = new queryType(modelType.type, ...args);
                        query.components.push(modelInterface);
                        return new Proxy(query, {
                            get: (query, property) => {
                                if (property == "then") {
                                    return function(arg1, arg2) {
                                        var scope;
                                        var next;
                                        if (arg1 instanceof Scope) {
                                            scope = arg1;
                                            next = arg2;
                                        } else {
                                            next = arg1;
                                            scope = new Scope();
                                        }
                                        if (!next)
                                            next = (result) => {
                                                return result;
                                            }
                                        scope.push(query)
                                        return self.execute(scope)
                                            .then(() => {
                                                return query.result;
                                            }).then((result) => {
                                                return next ? next(result) : result
                                            });
                                    }
                                } else
                                    return query[property];
                            }
                        });
                    }
                }
                var name = stringUtils.plural(modelType.type.name);
                this[name] = modelInterface
                modelInterface.name = name;
                this.push(modelInterface);
            })
        }

        setup(scope, next) {
            var types = this.modelTypes.map((modelType) => {
                return modelType.type
            });
            scope.push(this);
            scope.push(...types)
            return super.setup(scope, next || (() => {
                return Promise.resolve(0)
            }))
        }

        execute(scope, next) {
            scope.push(this);
            return super.execute(scope, next || (() => {
                return Promise.resolve(0)
            }))
        }

        stop(scope, next) {
            return super.stop(scope, next || (() => {
                return Promise.resolve(0)
            }))
        }
    }

    return ModelInterfaces;
})