var Property = require("../../index");
class NumberProperty extends Property {
    transform(owner, value) {
        value = super.transform(owner, value);
        if (typeof(value) != "number")
            value = parseInt(value);
        return value;
    }
}

module.exports = NumberProperty;