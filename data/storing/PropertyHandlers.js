const Model = require("../Model");
const Models = require("../Models");
const Properties = require("sools-define/Properties");
Properties.handlers.push({
    handle: (propertyName, obj) => {
        return (obj.prototype instanceof Model) || Model == obj;
    },
    build: (propertyName, obj) => {
        return new Properties.types.object({
            name:propertyName,
            type: obj,
            onSet: function(newValue, oldValue) {
                if (newValue)
                    newValue.hold();
                if (oldValue)
                    oldValue.release();
            }
        })
    }
}, {
    handle: (propertyName, obj) => {
        return (obj.prototype instanceof Models) || obj == Models
    },
    build: (propertyName, obj) => {
        return new Properties.types.object({
            name: propertyName,
            type: obj,
            onSet: function(newValue, oldValue) {
                if (newValue)
                    newValue.hold();
                if (oldValue)
                    oldValue.release();
            }
        })
    }
})

