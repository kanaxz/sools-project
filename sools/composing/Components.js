class Components extends Array {

    get(type) {
        return this.find((c) => {
            return c instanceof type
        })
    }

    getAll(type) {
        return this.filter((c) => {
            return c instanceof type;
        })
    }
}

module.exports = Components