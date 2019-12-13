const sools = require("../sools");
const Array = require("../propertying/Array");
const Process = require("../processing/Process");
const Factory = require("../Factory");
const Flow = require("../processing/Flow");
const Segment = require("../processing/Segment");
const Scope = require("../processing/Scope");
const Query = require("./Query");
const Queries = Array.of(Query);
const stringUtils = require("../string/utils");
const ModelInterface = require("./ModelInterface");
const QueriesEnum = require("./Query/enum");
const Model = require("./Model");
const Models = Array.of(Model)

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
            this.modelTypes.forEach((modelType) => {
                var modelInterface = { type: modelType, modelsFactory: new Factory() };

                for (let queryType of QueriesEnum) {
                    modelInterface[queryType.type.name] = (...args) => {
                        var query = new queryType(modelType.type,...args);
                        return new Proxy(query, {
                            get: (query, property) => {
                                if (property == "then") {
                                    return async (arg1, arg2)=> {
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
                                        scope.push(new Queries([query]))
                                        await this.execute(scope)
                                        return query.result;
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