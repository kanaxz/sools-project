class Dependencies extends Array {
    constructor(values){
    	super(...values);
    }
    get(fn) {
        return this.find((dependency) => {
            return dependency.fn == fn;
        })
    }

    has(fn) {
        return this.get(fn) != null;
    }
}

module.exports = Dependencies;