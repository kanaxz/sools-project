var Process = require("./Process");

class Dynamic extends Process {
    constructor(setupFn, executeFn) {
        super();
        this.setupFn = setupFn;
        this.executeFn = executeFn;
    }

    setup(scope, next) {
           if (this.setupFn)
            return this.setupFn(scope, next);
        else
            return next();
    }


    execute(scope, next) {
        if (this.executeFn)
            return this.executeFn(scope, next);
        else
            return next();
    }
}

module.exports = Dynamic;