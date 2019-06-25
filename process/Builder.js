var Process = require("./Process");

var Uniqueable = require("sools-define/Uniqueable");
var propertyTypes = require("sools-define/propertyTypes");
var Typeable = require("sools-define/Typeable");
var Types = require("sools-define/Types");
var Instances = require("sools-define/Instances");
var Propertiable = require("sools-define/Propertiable");
class Builder extends Process {
    constructor(params) {
        super();
        params = params || {};
        this.source = params.source;
        this.type = params.type;
        this.isArray = params.isArray || false;
        this.options = params.options || [];
    }

    feedOptions(context, type) {
        if (type.dependencies.has(Uniqueable)) {

            var instances = context.components.getAll(type);
            if (instances.length != 0) {

                this.options.push(new Instances(type, instances));
            }
        }

        if (type.dependencies.has(Typeable)) {
            var types = context.components.filter((c) => {
                return c.prototype instanceof type;
            });
            if (types.length != 0) {
                this.options.push(new Types(type, types));
                for (var subType of types)
                    this.feedOptions(context, subType)
            }
        }


        if (type.dependencies.has(Propertiable) && type.properties) {
            for (var prop of type.properties) {
                if (prop instanceof propertyTypes.array || prop instanceof propertyTypes.object) {
                    if (prop.type) {
                        this.feedOptions(context, prop.type)
                    }
                }
            }
        }

    }

    setup(context, next) {
        return super.setup(context, next).then(() => {
            this.feedOptions(context, this.type);
        })
    }

    execute(context, next) {
        var object = this.source(context);
        if (this.isArray) {
            for (var obj of object) {
                var result = this.type.build(obj, this.options);
                context.components.push(result);
            }
        } else {
            var result = this.type.build(object, this.options);
            context.components.push(result);
        }
        return super.execute(context, next);
    }
}

module.exports = Builder;