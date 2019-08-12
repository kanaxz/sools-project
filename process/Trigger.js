var Flow = require("./Flow");

class Trigger extends Flow {


    setup(scope) {
        return super.setup(scope, () => {
            return Promise.resolve(0)
        })
    }

    execute(scope) {
        return super.execute(scope, () => {
            return Promise.resolve(0)
        })
    }

    stop(scope) {
        return super.stop(scope, () => {
            return Promise.resolve(0)
        })
    }

}

module.exports = Trigger;