const Number = require("./Number");
const Handler = require("../../Handler");
const utils = require("../../utils")
const Function = require("./Function");
const ArraySource = require("../../Source/enum/Array")
const Virtual = require("../../Virtual")



const template = Template.of(Virtual)

const fnArg = {
  type: Function,
  required: true,
  args: [template]
}

const VirtualArray = Virtual.define({
  name: 'array',
  template,
  handler: class extends Handler {

    constructor(options) {
      super(options)
    }

    static buildArg(options) {
      const { scope, args, description } = options
      if (description.spread) {
        const spreadArgs = []
        while (args.length) {
          spreadArgs.push(args.shift())
        }
        options.args = [spreadArgs]
      }
      return super.buildArg(options)

    }

    static parse(scope, array) {
      if (!(array instanceof Array)) {
        throw new Error()
      }
      array = array.map((value) => {
        if (!(value instanceof this.template)) {
          value = this.template.handler.parse(scope, value);
        }
        return value._handler || value;
      });
      [...array].reverse().forEach((value) => {
        scope.processArg(value);
      })
      return new this.virtual({
        scope,
        source: new ArraySource(array)
      })
    }

    static cast(arg) {
      return arg instanceof Array
    }
  },
  class: (base) => {
    return class CArray extends base {
      constructor(options) {
        if (!options) {
          options = {
            source: new ArraySource()
          }
        }

        super(options);
      }
      [Symbol.iterator]() {
        var object;
        var scope;
        var varId = utils.gererateVariableId();
        this.forEach(eval(`(${varId},$)=>{
					object = ${varId};
					scope = $._private;
				}`))
        scope.parent._child = scope;

        var done = -1;
        return {
          next: () => {
            done++;
            if (done == 0)
              scope.parent._child = null;
            return { value: object, done: done == 1 }
          }
        }
      }
    }
  },
  methods: {
    push: {
      args: (T) => [VirtualArray.of(T.template)]
    },
    indexOf: {
      args: (T) => {
        return [T.template]
      },
      return: Number
      /*
      return: (source) => {
        return new Number({
          source
        })
      }
      /**/
    },
    length: {
      args: [],
      return: Number,
      /*
      return: (source) => {
        return new Number({
          source
        })
      }
      /**/
    },
    atIndex: {
      args: [Number],
      return: template,
      /*
      return: (source) => {
        return new source.args[0].template({
          source: source
        })
      },
      /**/

    },
    filter: {
      args: [fnArg],
      return: THIS,
      /*
      return: (source) => {
        return source.function.thisArg.clone({
          source
        })
      },
      /**/
    },
    find: {
      args: [fnArg],
      return: template,
      /*
      return: (source) => {
        return new source.args[0].template({
          source
        })
      },
      /**/
    },
    forEach: {
      args: [fnArg],
      return: THIS
      /*
      return: (source) => {
        var array = source.args[0];
        return array.clone({
          source
        })
      },
      /**/
    },
    map: (() => {
      const mapTemplate = Template.of(Virtual)
      return {
        template: mapTemplate,
        args: [fnArg],
        return: mapTemplate,
        /*
        return: (source) => {
          var rtrn = source.args[1].source.scope.statements.find((statment) => statment.function.source.name == 'return').args[0];
          var array = source.args[0];
          return array.clone({
            source,
            type: rtrn
          })
        },
        /**/
      }
    })()
  },
})

module.exports = VirtualArray;