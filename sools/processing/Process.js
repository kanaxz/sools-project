const Base = require("../core/Base");

class Process extends Base {
    constructor() {
        super();
    }

    setup(scope, next) {
        return next();
    }

    execute(scope, next) {
        return next();
    }

    stop(scope, next){
    	return next();
    }
}

module.exports = Process;