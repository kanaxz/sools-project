const Array = require("sools/Array")
class BindedFunctions extends Array {

    constructor(instance) {
        super();
        this.instance = instance;
    }

    get(fn) {
        var existing = this.find((bf) => {
            return bf.initialFunction == fn;
        })
        if (existing)
            return existing.fn;
        var bindedFunction = fn.bind(this.instance);
        this.push({
            initialFunction: fn,
            fn: bindedFunction
        });
        return bindedFunction;
    }
}

module.exports = BindedFunctions;