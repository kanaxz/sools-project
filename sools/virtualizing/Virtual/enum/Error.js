const String = require("./String");
const Object = require("./Object")

module.exports = Object
  .define({
    name: 'error',
  })
  .properties({
    message: String
  })