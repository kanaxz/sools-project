const Base = require("./Base")

module.exports = Base.defineType({
  name: 'datetime',
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
