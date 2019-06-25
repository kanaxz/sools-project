const sools = require("sools");
const NotImplemented = require("sools/errors/NotImplemented");
module.exports = sools.define((base) => {
    class Handler extends base {
        constructor(repeater, source) {
            super();
            this.repeater =repeater;
            this.source = source;
        }

        forEach(fn){
        	throw new NotImplemented();
        }
    }

    return Handler;
})