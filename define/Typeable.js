var sools = require("../sools")
var Type = require("./Type");
var Buildable = require("./Buildable");
var Comparable = require("./Comparable");
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
            if (object.type && object.values) {
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
                            return subType.type.equals(object.type);
                        })
                        if (subType)
                            return subType.build(object.values, buildOptions);
                        else
                            throw new Error("Type not found");
                    }
                }
                throw new Error(`Could not build '${this.name}'`)
            } else
                return super.build(object, buildOptions);
        }


        toJSON(options) {
            return {
                type: this.constructor.type.toJSON(options),
                values: super.toJSON(options)
            }
        }

        equals(object) {
            if (object.type && object.values)
                return super.equals(object.values);
            else
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