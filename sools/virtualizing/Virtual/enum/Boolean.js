const Virtual = require("../index")

const Boolean = Virtual
  .define({
    name: 'boolean',
  })
  .handler((Handler) => {
    return class Bool extends Virtual.handler {
      static cast(arg) {
        return typeof (arg) == "boolean"
      }
    }
  })

Virtual.boolean = Boolean;
//Base.Boolean = Boolean
module.exports = Boolean;