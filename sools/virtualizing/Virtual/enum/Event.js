const Function = require("./Function")
const Template = require('./Template')
const Virtual = require('../index')

const template = Template.of(Virtual)

module.exports = Function
  .define({
    name: 'event',
    template,
    args: [() => [null, [template]]]
  })