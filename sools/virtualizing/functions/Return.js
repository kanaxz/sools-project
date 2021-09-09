const Function = require("../Virtual/enum/Function")
const Virtual = require("../Virtual")
const Var = require('../Source/enum/Var')
const Scope = require('../Scope')

const Return = new Function({
  source: new Var('return'),
  args: [Virtual]
})

Scope.Return = Return

module.exports = Return