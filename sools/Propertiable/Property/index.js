class Property {
    constructor(params) {
        if(!params)
            return
        this.name = params.name;
        this.setDefault = params.setDefault;
        this.defaultValue = params.default;
        this.transformFunction = params.transform;
        this.onSet = params.onSet;
    }

    merge(owner, object){
        owner[this.name] = object;
    }

    canBuild(object){
        return true;
    }

    build(object) {
        return object;
    }

    toJSON(object) {
        return object;
    }

    attachType(ownerType) {
        this.ownerType = ownerType
    }

    transform(owner, value) {
        if (this.transformFunction) {
            value = this.transformFunction.call(owner, value);
        }
        return value;
    }

    default () {
        if (this.defaultValue) {
            if (typeof this.defaultValue == "function")
                return this.defaultValue();
            else
                return this.defaultValue;
        }
    }

    set(owner, newValue, oldValue) {
        owner._values[this.name] = newValue;
        if (this.onSet) {
            this.onSet.call(owner, newValue, oldValue);
        }
    }

    equal(value1, value2) {
        return value1 == value2;
    }
}

module.exports = Property;