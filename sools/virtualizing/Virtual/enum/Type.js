const Virtualizing = require("../../index")
const Handler = require("../../Handler")

module.exports = Virtualizing.defineType({
  name: 'type',
  handler: class extends Handler {
    static buildArg({ scope, arg }) {
      return this.parse(scope, arg)
    }

    static parse(scope, value) {
      return new this.virtual({
        scope,
        source: value
      })
    }
  }
})
