const sools = require("sools");
const Array = require("sools-define/Array");
module.exports = sools.define([Array()], (base) => {
    class Models extends base {
        toJSON() {
            return this.content;
        }
    }

    return Models;
})