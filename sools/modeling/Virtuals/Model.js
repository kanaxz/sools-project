const Object = require("../../../../virtualizing/Virtual/enum/Object")
const RelationSelector = require('./RelationSelector')

const Model = Object.define({
  name: 'model',
}).methods({
  unload: [[RelationSelector.of(THIS)]],
  load: [[RelationSelector.of(THIS)]]
})

module.exports = Model
