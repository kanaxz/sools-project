const Base = require("./Base");
const Number = require("./Number")
const Scope = require('../../Scope')

const String = Base
  .define({
    name: 'string',
  })
  .properties({
    length: Number
  })


Scope.String = String

module.exports = String