var Property = require("../../index");
class ArrayProperty extends Property {
    constructor(params) {
        super(params);
        this.type = params.type;
    }

    buildContainer() {
        return [];
    }

    build(array, options) {
        var result = this.buildContainer();

        for (var object of array) {
            if (this.type)
                result.push(this.type.build(object, options));
            else
                result.push(object)
        }
        return result;
    }


    toJSON(array, options) {
        var result = [];
        for (var object of array) {
            if (this.type)
                result.push(object.toJSON(options));
            else
                result.push(object)
        }
        return result;
    }

    default () {
        var result = super.default();
        return typeof(result) == "undefined" ? this.buildContainer() : result;
    }

    equal(array1, array2) {
        if (!this.type)
            throw new Error("Cannot compare object without type");
        if (array2.length != array1.length)
            return false;
        for (var i = 0; i < array1.length; i++) {
            if (!array1[i].equals(array2[i]))
                return false;
        }
    }
}

module.exports = ArrayProperty;