class Types extends Array {
    constructor(type, values) {
        super(...values);
        this.type = type;
    }
}

module.exports = Types;