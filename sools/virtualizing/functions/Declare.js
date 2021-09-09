const Function = require("../Virtual/enum/Function")
const String = require("../Virtual/enum/String")
const Var = require('../Source/enum/Var')
const Scope = require('../Scope')
const Virtual = require('../Virtual')

const Declare = new Function({
  source: new Var('declare'),
  args: [String, Virtual]
})

Scope.Declare = Declare

module.exports = Declare