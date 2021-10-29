const Source = require("../index")

module.exports = class Property extends Source {
  constructor(values) {
    super();
    for (var p in values)
      this[p] = values[p];
  }

  toJSON() {

    var sourceJSON = this.owner.toJSON();
    return sourceJSON + "." + this.path;

  }
}