var rawMixin = require("./rawMixin")
module.exports = rawMixin(class Tree {
  constructor(...values) {
    this.content = values
  }
});