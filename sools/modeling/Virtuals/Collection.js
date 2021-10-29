const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Model = require("./Model")
const Function = require("../../../../virtualizing/Virtual/enum/Function")
const Query = require('./Query')
const Event = require('../../../../virtualizing/Virtual/enum/Event')
const Object = require('../../../../virtualizing/Virtual/enum/Object')
const Template = require('../../../../virtualizing/Virtual/enum/Template')
const Context = require('./Context')

const modelTemplate = Template.of(Model)
const contextTemplate = Template.of(Context)

const EventArguments = Object
  .define({
    name: 'EventArguments',
    templates: [contextTemplate, modelTemplate],
  })
  .properties({
    context: contextTemplate,
    source: Array.of(modelTemplate),
    next: Function.define(Array.of(modelTemplate), [Array.of(modelTemplate)])
  })

module.exports = Function
  .define({
    name: 'Collection',
    templates: [contextTemplate, modelTemplate],
    return: Query.of(modelTemplate),
  })
  .methods({
    push: [Array.of(modelTemplate), [Array.of(modelTemplate).define({ spread: true })]],
  })
  .properties({
    onPush: Event.of(EventArguments.of(contextTemplate, modelTemplate)),
    onGet: Event.of(EventArguments.of(contextTemplate, modelTemplate)),
    onUpdate: Event,
    onDelete: Event.of(EventArguments.of(contextTemplate, modelTemplate)),
  })