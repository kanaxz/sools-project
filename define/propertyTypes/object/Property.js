var Property = require("../../Property");
class ObjectProperty extends Property {
    constructor(values) {
        super(values);
        this.type = values.type;
    }

    build(object, options) {
        if (object == null)
            return null;
        if (this.type) {
            return this.type.build(object, options);
        } else
            return object;
    }

    toJSON(object, options) {
        if (object == null)
            return null;
        if (this.type) {
            return object.toJSON(options);
        } else
            return object;
    }

    default () {
        var result = super.default();
        return typeof(result) == "undefined" ? new this.type({}) : result;
    }

    equal(object1, object2) {
        if (!this.type)
            throw new Error("Cannot compare object without type");
        return object1.equals(object2);
    }
}

module.exports = ObjectProperty;