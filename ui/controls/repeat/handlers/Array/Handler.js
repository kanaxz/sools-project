const Handler = require("../Handler");
const It = require("./It")
class ArrayHandler extends Handler {
    static handle(source) {
        return source[Symbol.iterator]
    }

    forEach(fn) {
        this.source.forEach((object, index) => {
            fn(new It({
                object,
                index
            }))
        })
    }
}

module.exports = ArrayHandler;