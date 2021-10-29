const Virtual = require("../index")

module.exports = Virtual
  .define({
    name: 'type',
  })
  .handler((Handler) => {
    return class extends Handler {
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
