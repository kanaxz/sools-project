var sools = require("sools")
var Buildable = require("./Buildable");
var Comparable = require("./Comparable");
var Instances = require("./Instances");
module.exports = sools.mixin([Buildable(), Comparable()], (base, options) => {
    options = options || {};
    class Uniqueable extends base {
        constructor(...args) {
            super(...args);
            if (options.build && options.build.cache && this.constructor.buildInstances) {
                this.constructor.buildInstances.push(this)
            }
            if (options.cache !== false) {
                this.constructor.instancesArray.push(this);
            }
        }

        static define(args) {
            super.define(args);
            if (options.cache !== false) {
                this.instancesArray = new Instances(this);
            }
        }

        static build(object, buildOptions) {
            var scopeCreatedBuildInstances;
            var instance;
            if (options.build && options.build.cache) {
                if (!this.buildInstances) {
                    scopeCreatedBuildInstances = true;
                    this.buildInstances = new Instances(this);
                    buildOptions = [...buildOptions, this.buildInstances]
                }
            }

            var instancesArray;
            if (buildOptions) {
                instancesArray = buildOptions.filter((option) => {
                    var dependencies = option.constructor.dependencies;
                    return dependencies && dependencies.has(Instances.mixin);
                });
            } else
                instancesArray = [];
            if (options.cache !== false)
                instancesArray.push(this.instances);
            for (var instances of instancesArray) {
                if (instances.type == this) {
                    var instance = instances.find((instance) => {
                        return instance.equals(object);
                    })
                    if (instance)
                        break;
                }
            }
            if (instance) {
                if (options.merge)
                    instance.merge(object);
            } else if (options.build)
                instance = super.build(object, buildOptions);
            if (scopeCreatedBuildInstances)
                this.buildInstances = null;
            if (instance)
                return instance;
            throw new Error(`'${this.name}' instance not found`);

        }
    }

    return Uniqueable;
})