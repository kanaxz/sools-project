var MissingArgument = require("../errors/MissingArgument");
var Base = require("./Base");
var Definitions = require("./Definitions");
var Dependencies = require("./Dependencies");
const rooty= require("rooty")
rooty("../")
function defaultMixin(base) {
    return class extends base {}
}

var sools = {
    proxy(...args) {
        var fn = this.mixin(...args);
        var type = this.define([fn()]);
        type.mixin = fn;

        return new Proxy(type, {
            apply: (target, thisArg, args) => {
                //fallback for babel ?
                if(thisArg){
                    return target.apply(thisArg, args);
                }
                return fn.apply(null, args);
            }
        })
    },
    mixin(...args) {

        var dependencies;
        var mixinFn;
        var definitions;
        if (args.length == 1) {
            if (args[0] instanceof Array) {
                dependencies = args[0];
                mixinFn = defaultMixin;
            } else {
                mixinFn = args[0];
            }

        } else if (args.length == 2) {
            if (args[0] instanceof Array) {
                dependencies = args[0];
                if (typeof args[1] == "function") {
                    mixinFn = args[1]
                } else if (args[1] instanceof Array) {
                    definitions = args[1];
                    mixinFn = defaultMixin;
                }

            } else {
                mixinFn = args[0];
                definitions = args[1];
            }
        } else if (args.length == 3) {
            dependencies = args[0];
            mixinFn = args[1];
            definitions = args[2];
        }
        definitions = definitions || [];
        mixinFn = mixinFn || defaultMixin;
        var mixin = {
            fn: mixinFn,
            definitions: definitions ? new Definitions(...definitions) : null,
            dependencies: dependencies
        }

        var fn = (...args) => {
            return {
                fn: fn,
                mixin: mixin,
                args: args
            }
        }
        fn.mixin = mixin;
        return fn;
    },
    findDependencyIndex(dependency, dependencies, result) {
        return dependencies.findIndex((d) => {
            return d.mixin == dependency.mixin;
        })
    },
    processDependency(result, dependency) {
        var existingIndex = -1;
        if (result.base.dependencies){
            existingIndex = this.findDependencyIndex(dependency, result.base.dependencies, result);
        }
        if (existingIndex == -1) {
            existingIndex = this.findDependencyIndex(dependency, result.dependencies)
            if (existingIndex == -1) {
                // dependency not added
                if (dependency.mixin.dependencies) {
                    this.processDependencies(result, dependency.mixin.dependencies);
                }
                result.dependencies.push(dependency);
                if (dependency.mixin.definitions)
                    result.definitions.push(dependency.mixin.definitions)
            } else {
                // dependency already added
            }
        } else {
            // baseClass has already the dependency
        }

    },
    processDependencies(result, dependenciesTree) {
        for (var dependency of dependenciesTree) {
            this.processDependency(result, dependency);
        }
    },
    buildBase(base, dependenciesTree, definitions) {
        var result = {
            dependencies: [],
            definitions: definitions,
            base
        }
        if (dependenciesTree)
            this.processDependencies(result, dependenciesTree)
        var currentClass = base;
        for (var dependency of result.dependencies) {
            currentClass = dependency.mixin.fn(currentClass, ...dependency.args);
        }
        if (base.dependencies) {
            result.dependencies = [...base.dependencies, ...result.dependencies];
        }
        result.base = currentClass;
        return result;
    },
    define(...args) {
        var base;
        var dependencies;
        var typeFn;
        var definitions;
        if (args.length == 1) {
            var arg = args[0];
            if (arg instanceof Array) {
                dependencies = arg
                typeFn = defaultMixin;
            } else if(arg.prototype instanceof Base) {
                base = arg;
                typeFn = defaultMixin;
            }
            else
                typeFn = arg;

        } else if (args.length == 2) {
            if (args[0] instanceof Array) {
                dependencies = args[0];
                if (args[1] instanceof Array) {
                    definitions = args[1];
                    typeFn = defaultMixin;
                } else {
                    typeFn = args[1]
                }

            } else if (args[1] instanceof Array) {
                if(args[0].isBase)
                    base = args[0]
                else
                    typeFn = args[0];
                definitions = args[1];
            } else {
                base = args[0];
                typeFn = args[1];
            }
        } else if (args.length == 3) {
            if (args[0] instanceof Array) {
                dependencies = args[0];
                typeFn = args[1]
                definitions = args[2];
            } else {
                base = args[0];
                if (args[1] instanceof Array) {
                    dependencies = args[1];
                    typeFn = args[2]
                } else {
                    typeFn = args[1]
                    definitions = args[2];
                }

            }
        } else {
            base = args[0];
            dependencies = args[1];
            typeFn = args[2];
            definitions = args[3];
        }
        typeFn = typeFn || ((base)=>{
            return class extends base{}
        })
        base = base || Base;
        definitions = (definitions ? new Definitions(...definitions) : new Definitions());
        var result = this.buildBase(base, dependencies, definitions);
        var type = typeFn(result.base);
        
        type.dependencies = new Dependencies(result.dependencies);
        type.define(definitions);
        return (type);
    }
}


sools.class = sools.define;
module.exports = sools;