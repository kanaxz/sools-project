var Process = require("./Process");

class Dynamic extends Process {
    constructor(setupFn, executeFn) {
        super();
        this.setupFn = setupFn;
        this.executeFn = executeFn;
    }

    setup(context, next) {
           if (this.setupFn)
            return this.setupFn(context, next);
        else
            return next();
    }


    execute(context, next) {
        if (this.executeFn)
            return this.executeFn(context, next);
        else
            return next();
    }
}

module.exports = Dynamic;