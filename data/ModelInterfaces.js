const sools = require("sools");
const Flow = require("sools-process/Flow");
const Segment = require("sools-process/Segment");
const Context = require("sools-process/Context");
const Query = require("./Query");
const stringUtils = require("sools/string/utils");
const ModelInterface = require("./ModelInterface");
const Queries = require("./Queries");
const Array = require("sools-define/Array");
const Models = require("./Models")
const Model = require("./Model");

module.exports = sools.define(Flow, [Array()], (base) => {

    class ModelInterfaces extends base {
        constructor(modelTypes) {
            super();
            this.modelTypes = modelTypes;
            this.modelInterfaces = new Segment();
            //this.then(this.modelInterfaces);
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
                var modelInterface = new ModelInterface(this,modelType);

                for (let queryType of Queries) {
                    this.modelInterfaces.then(modelInterface);
                    modelInterface[queryType.type.name] = (...args) => {
                        var query = new queryType(modelType.type, ...args);
                        query.components.push(modelInterface);
                        return new Proxy(query, {
                            get: (query, property) => {
                                if (property == "then") {
                                    return function(arg1, arg2) {
                                        var context;
                                        var next;
                                        if (arg1 instanceof Context) {
                                            context = arg1;
                                            next = arg2;
                                        } else {
                                            next = arg1;
                                            context = new Context();
                                        }
                                        if (!next)
                                            next = (result) => {
                                                return result;
                                            }
                                        context.push(query)
                                        return self.execute(context)
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

        setup(context, next) {
            var types = this.modelTypes.map((modelType) => {
                return modelType.type
            });
            context.push(this);
            context.push(...types)
            return super.setup(context, next || (() => {
                return Promise.resolve(0)
            }))
        }

        execute(context, next) {
            context.push(this);
            return super.execute(context, next || (() => {
                return Promise.resolve(0)
            }))
        }

        stop(context, next) {
            return super.stop(context, next || (() => {
                return Promise.resolve(0)
            }))
        }
    }

    return ModelInterfaces;
})