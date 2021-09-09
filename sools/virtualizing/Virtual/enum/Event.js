const Function = require("./Function")
const Object = require('./Object')

const EventArguments = Object.define({

})

const template = Template.of(EventArguments)

const Event = Function.define({
  name: 'event',
  template,
  args: [{
    type: Function,
    args: [template]
  }]
})

module.exports = Event