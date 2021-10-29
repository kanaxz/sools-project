const Array = require('../../../../virtualizing/Virtual/enum/Enumerable')
const Model = require('./Model')
const Template = require('../../../../virtualizing/Virtual/enum/Template')

const template = Template.of(Model)

module.exports = Enumerable
  .of(template)
  .define({
    name: 'Query',
  })
  .methods({
    get: [Array.of(template)],
    update: [null, [
      () => [null, [Array.of(template)]],
    ]],
    delete: [],
  })