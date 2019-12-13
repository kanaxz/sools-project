var Enum = {
    null: 0,
    clean: 1,
    dirty: 2
}

var sools =  require("../sools");
var BindableFunctions = require("../BindingFunctions/BindableFunctions");

module.exports = sools.mixin((baseClass) => {
    class Stateable extends baseClass {

        constructor(...args) {
            super(...args);
            this.states = {};
            this.default();
        }

        valueChanged(property, newValue, oldValue) {
            super.valueChanged()
        }

        default () {
            var properties = this.properties;
            properties.forEach((p) => {
                if (this[p.name] == null)
                    this.states[p.name] = Enum.null;
                else
                    this.obj[p.name] = Enum.clean;
            })
        }

        valueChanged(property, newValue, oldValue) {
            this.dirty(property.name);
        }

        dirty(propertyName) {
            this.set(Enum.dirty, propertyName)
        }

        setState(state, propertyName) {
            if (!propertyName) {
                this.properties.forEach((p) => {
                    this.setState(state, p.name);
                })
            } else {
                this.states[propertyName] = state;
            }
        }

        clean(propertyName) {
            this.set(Enum.clean, propertyName)
        }
    }

    States.enum = Enum;
    return (States);
})