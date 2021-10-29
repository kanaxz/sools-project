const Virtual = require("../index")
const Boolean = require('./Boolean')

const Base = Virtual
  .define()
  .methods(() => {
    return {
      ...['gt', 'lt', 'eq'].reduce((methods, method) => {
        methods[method] = [Boolean, [THIS]]
        return methods
      }, {}),
      ...['add', 'subtract', 'multiply', 'divide', 'modulo'].reduce((methods, method) => {
        methods[method] = [THIS, [THIS]]
        return methods
      }, {})
    }
  })()

module.exports = Base
