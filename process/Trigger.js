var Flow = require("./Flow");

class Trigger extends Flow {


    setup(context) {
        return super.setup(context, () => {
            return Promise.resolve(0)
        })
    }

    execute(context) {
        return super.execute(context, () => {
            return Promise.resolve(0)
        })
    }

    stop(context) {
        return super.stop(context, () => {
            return Promise.resolve(0)
        })
    }

}

module.exports = Trigger;