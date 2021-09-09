
const Virtual = require("./Virtual")
const Var = require('./Source/enum/Var')

const Global = new Virtual({
  source: new Var('global')
})


module.exports = Global