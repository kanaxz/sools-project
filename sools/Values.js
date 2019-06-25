class Values {
    constructor(values) {
        for(var propertyName in values)
            this[propertyName] = values[propertyName];
    }
}

module.exports = Values;