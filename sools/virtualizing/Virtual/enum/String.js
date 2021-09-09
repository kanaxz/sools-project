const Base = require("./Base");
const Number = require("./Number");
const Value = require("../../Source/enum/Value")
const Scope = require('../../Scope')

const String = Base.define({
  name: 'string',
  handler: class String extends Base.handler {
    static cast(arg) {
      return typeof (arg) == "string"
    }

    static parse(scope, value) {
      return new this.virtual({
        source: new Value(value),
        scope
      })
    }
  },
  properties: {
    length: Number
  }
})

Scope.String = String

module.exports = String