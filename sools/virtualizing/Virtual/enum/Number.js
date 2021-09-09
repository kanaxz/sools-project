const Virtualizing = require("../../index");
const Base = require("./Base")

module.exports = Virtualizing.defineType({
  name: 'number',
  extends: Base,
  handler: class Number extends Base.handler {
    static cast(arg) {
      return typeof (arg) == "number"
    }
  },
  methods: (Number) => {
    return ['add', 'subtract', 'multiply', 'divide', 'modulo'].reduce((methods, method) => {
      methods[method] = {
        args: [THIS],
        return: THIS
        /*
        return:function(source){
          return new Number({
            source
          })
        },
        args:[Number,Number]
        /**/
      }
      return methods
    }, {})
  }
})