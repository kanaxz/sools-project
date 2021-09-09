const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Model = require("./Model")
const Function = require("../../../../virtualizing/Virtual/enum/Function")
const Query = require('./Query')
const Event = require('../../../../virtualizing/Virtual/enum/Event')
const Object = require('../../../../virtualizing/Virtual/enum/Object')

const template = Template.of(Model)

const EventArguments = Object.define({
  name: 'EventArguments',
  template,
  properties: {
    source: Array.of(template),
    next: {
      type: Function,
      args: [Array.of(template)],
      return: Array.of(template)
    }
  }
})

module.exports = Function.define({
  name: 'collection',
  template,
  return: Query.of(template),
  methods: {
    push: {
      return: Array.of(template),
      args: [Array.of(template)]
    },
  },
  properties: {
    onPush: Event.of(EventArguments.of(template)),
    onGet: Event.of(EventArguments.of(template)),
    onUpdate: Event,
    onDelete: Event.of(EventArguments.of(template)),
  }
})