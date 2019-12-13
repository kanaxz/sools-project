var sools = require("../sools")
var Type = require("./Type");
var Buildable = require("../building/Buildable");
var Comparable = require("../comparing/Comparable");
var Types = require("./Types");
module.exports = sools.mixin([Buildable(), Comparable()], (base, options) => {
    if (typeof options == "function") {
        options = {
            type: options,
            cache: true
        }
    }
    class Typeable extends base {
        static define(args) {
            if (options.cache !== false && !this.types)
                this.types = new Types(this, []);
            var type = args.find((arg) => {
                return arg instanceof options.type;
            })
            if (type) {
                if (options.cache !== false)
                    this.types.push(this);
                this.type = type;
                type.attach(this);
            }
            super.define(args);
        }

        static build(object, buildOptions) {
            var typeName = object[this.constructor.type.constructor.typeName];
            if (typeName) {
                var typesArray;
                if (buildOptions) {
                    typesArray = buildOptions.filter((option) => {
                        return option instanceof Types
                    });
                }
                else
                    typesArray = [];
                if (options.cache !== false)
                    typesArray.push(this.types)
                for (var types of typesArray) {
                    if (types.type == this) {
                        var subType = types.find((subType) => {
                            return subType.type.equals(object[typeName]);
                        })
                        if (subType)
                            return subType.build(object, buildOptions);
                        else
                            throw new Error("Type not found");
                    }
                }
                throw new Error(`Could not build '${this.name}'`)
            } else
                return super.build(object, buildOptions);
        }


        toJSON(options) {
            var result = super.toJSON(options);            
            result[this.constructor.type.constructor.typeName] = this.constructor.type.name
            return result;
        }

        equals(object) {
            return super.equals(object);
        }

        constructor(...args) {
            super(...args);
            if (!this.constructor.type)
                throw new Error("Type not set");
        }
    }

    return Typeable;
})