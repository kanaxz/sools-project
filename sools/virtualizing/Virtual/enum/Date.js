const Base = require("./Base")

module.exports = Base.define({
  name: 'date',
  methods: (Date) => {
    return ['add', 'subtract'].reduce((methods, method) => {
      methods[method] = {
        args: [THIS],
        return: THIS,
        /*
        return: function (source) {
          return new Number({
            source
          })
        },
        args: [Date, Date]
        /**/
      }
      return methods
    }, {})
  }
})
