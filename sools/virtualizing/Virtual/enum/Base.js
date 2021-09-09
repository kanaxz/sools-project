const Virtual = require("../index");
const Handler = require("../../Handler")
const Value = require("../../Source/enum/Value")
const Function = require('./Function')

const Base = Virtual.define({
  name: 'base',
  methods: (() => {
    var definition = {
      args: [THIS],
      return: Boolean,
      /*
      return: function (source) {
        return new Base.Boolean({ source })
      },
      args: (T) => [T]
      /**/
    }
    return ['gt', 'lt', 'eq'].reduce((methods, method) => {
      methods[method] = definition
      return methods
    }, {})
  })()
})

module.exports = Base
