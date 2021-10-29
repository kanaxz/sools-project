const Number = require("./Number")
const utils = require("../../utils")
const Function = require("./Function");
const ArraySource = require("../../Source/enum/Array")
const Virtual = require("../../Virtual")
const Template = require('./Template')

const template = Template.of(Virtual)

const fnArg = {
  type: Function,
  required: true,
  args: [template]
}

module.exports = Virtual
  .define({
    name: 'Enumerable',
    template,
  })
  .virtual((base) => {
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
  })
  .methods({
    indexOf: [Number, [template]],
    length: [Number],
    atIndex: [template, [Number]],
    filter: [THIS, [fnArg]],
    find: [THIS, [fnArg]],
    forEach: [THIS, [fnArg]],
    map: (() => {
      const mapTemplate = Template.of(Virtual)
      return [mapTemplate, mapTemplate, [fnArg]]
    })()
  })
