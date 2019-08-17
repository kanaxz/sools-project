const sools = require("sools");

const Limit = require("./index");
module.exports = sools.define(Limit, (base) => {
    class First extends base {
        constructor() {
            super(1);
        }

        processResult(type, results, next) {
            results = super.processResult(type, results, next);
            return results[0];
        }


        resultToJSON(type, results, next) {
            return next([results]);
        }
    }

    return First;
})