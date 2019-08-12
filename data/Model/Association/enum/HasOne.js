const Association = require("./Association");

class HasOne extends Association {
    constructor(values) {
        super(values);
        this.type = values.type;
    }


    build(object, options) {
        return this.type.build(object, options);
    }

    toJSON(object) {
        return object.toJSON();
    }

    modelAttached(model, instance) {
        if (instance) {
            var modelInterface = model.modelInterface.modelInterfaces.get(this.type);
            instance.attach(modelInterface);
        }
    }
}

module.exports = HasOne;