const Virtual = require('../../virtualizing/Virtual')
const Template = require('../../virtualizing/Virtual/enum/Template')

const template = Template.of(Virtual)

module.exports = Virtual  
  .of(template)
  .define({
    name: 'PropertySelector'
  })
  .handler((Handler) => {
    return class extends Handler {

    }
  })