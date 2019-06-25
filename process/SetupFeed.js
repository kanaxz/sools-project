var Process = require("./Process");

class SetupFeed extends Process {
    constructor(component) {
        super();
        this.component = component;
    }

    setup(context) {
        context.components.push(this.component)
    }
}

module.exports = SetupFeed;