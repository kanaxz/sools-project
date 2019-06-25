var Tree = require("./Tree");
const Base = require("./Base");

class Definitions extends Tree {

    get(type) {
        return this.find((definition) => {
            return definition instanceof type;
        })
    }
}
Base.circular.definitions = Definitions;
module.exports = Definitions;