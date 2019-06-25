const Base = require("sools/Base");

class Process extends Base {
    constructor() {
        super();
    }

    setup(context, next) {
        return next();
    }

    execute(context, next) {
        return next();
    }

    stop(context, next){
    	return next();
    }
}

module.exports = Process;