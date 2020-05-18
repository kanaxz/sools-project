var Process = require("./Process");

class Dynamic extends Process {
    constructor(options) {
        super();
        this.options = options
    }

    async setup(scope, next) {
        if (this.options.setup)
            return await this.options.setup(scope, next);
        else
            return next();
    }


    async execute(scope, next) {
        if (this.options.execute)
            return await this.options.execute(scope, next);
        else
            return next();
    }
}

module.exports = Dynamic;