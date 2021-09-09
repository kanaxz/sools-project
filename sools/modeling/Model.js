var sools = require("../../sools");
var Propertiable = require("../propertying/Propertiable");
const Data = require("./utils")
const VModel = require("./virtualizing/Virtual/enum/Model")

var Model = Data.defineType({
  type: class Model extends sools.extends([Propertiable()]) {

    constructor(values) {
      super(values);
      this.default();
    }

    attach(datas) {
      this.datas = datas;
    }

    load() {
      debugger
    }
  },
  virtual: VModel
})

Data.model = Model;

module.exports = Model;