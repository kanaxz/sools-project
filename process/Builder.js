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

    feedOptions(scope, type) {
        if (type.dependencies.has(Uniqueable)) {

            var instances = scope.components.getAll(type);
            if (instances.length != 0) {

                this.options.push(new Instances(type, instances));
            }
        }

        if (type.dependencies.has(Typeable)) {
            var types = scope.components.filter((c) => {
                return c.prototype instanceof type;
            });
            if (types.length != 0) {
                this.options.push(new Types(type, types));
                for (var subType of types)
                    this.feedOptions(scope, subType)
            }
        }


        if (type.dependencies.has(Propertiable) && type.properties) {
            for (var prop of type.properties) {
                if (prop instanceof propertyTypes.array || prop instanceof propertyTypes.object) {
                    if (prop.type) {
                        this.feedOptions(scope, prop.type)
                    }
                }
            }
        }

    }

    setup(scope, next) {
        return super.setup(scope, next).then(() => {
            this.feedOptions(scope, this.type);
        })
    }

    execute(scope, next) {
        var object = this.source(scope);
        if (this.isArray) {
            for (var obj of object) {
                var result = this.type.build(obj, this.options);
                scope.components.push(result);
            }
        } else {
            var result = this.type.build(object, this.options);
            scope.components.push(result);
        }
        return super.execute(scope, next);
    }
}

module.exports = Builder;