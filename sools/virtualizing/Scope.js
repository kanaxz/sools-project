const FunctionCall = require("./Source/enum/FunctionCall")
const utils = require("./utils")
const Value = require("./Source/enum/Value")
const Var = require("./Source/enum/Var")
var id = 0;

function processSource(arg) {

  if (arg.source instanceof FunctionCall) {

    if (arg.scope == arg.scope.target && arg.source == arg.scope.lastStatment) {
      arg.scope.statements.splice(-1, 1)
      arg.scope.removedStatements.push({
        index: arg.scope.statements.length,
        functionCall: arg.source
      })
    }
    else {
      var removedStatement = arg.scope.removedStatements.find((rs) => rs.functionCall == arg.source);
      if (removedStatement) {
        var index = arg.scope.removedStatements.indexOf(removedStatement);
        arg.scope.statements.splice(removedStatement.index, 0, removedStatement.functionCall);
        arg.scope.removedStatements.splice(index, 1)
      }
      var id = utils.gererateVariableId()
      var variable = arg.clone({
        source: new Var(id),
        scope: arg.scope
      });
      var index = arg.scope.statements.indexOf(arg.source);
      if (index == -1) {
        debugger
        throw new Error("Could not found statment")
      }
      var idVar = new Scope.String({
        source: new Value(id)
      })._handler
      arg.scope.statements.splice(index, 1, new FunctionCall({
        scope: arg.scope,
        function: Scope.Declare,
        args: [idVar, arg.clone({ scope: arg.scope, source: arg.source })]
      }));
      arg.source = variable._handler.source;
    }
  }
  return arg;
}

const repeatChar = (char, length) => {
  let s = ''
  for (let i = 0; i < length; i++) {
    s += char
  }
  return s
}


class Scope {
  constructor() {
    this.id = (id++)
    this.statements = []
    this.removedStatements = []
    this.vars = []
  }

  parse(arg) {
    for (var typeName in Scope.Env.types) {

      var type = Scope.Env.types[typeName]
      if (type.handler.cast(arg)) {
        return type.handler.parse(this, arg)
      }
    }
    throw new Error("Could not parse arg");
  }

  get target() {
    return this._child && this._child.target || this
  }

  child() {
    var child = new Scope();
    child.parent = this;
    this._child = child;
    return child;
  }

  process(fn, args = []) {
    var result = fn(...args)
    if (result != null) {
      if (!result || !result.constructor.isVirtual)
        result = this.parse(result)
      Scope.Return(result)
    }
    if (this.parent) {
      this.parent._child = null;
    }

    this.args = args.map((arg) => (arg && arg._handler) || arg);
    return this;
  }

  get lastStatment() {
    return this.statements[this.statements.length - 1];
  }

  processArg(arg) {
    return processSource(arg._handler || arg)
  }

  getVar(name) {
    var result = this.vars.find((v) => {
      if (!v.source)
        debugger
      return v.source.name == name
    });
    if (result)
      return result
    return this.parent && this.parent.getVar(name) || null
  }

  get level() {
    return this.parent && this.parent.level + 1 || 0
  }

  toJSON() {
    return `${repeatChar(' ', this.level)}(${this.args.map((arg) => arg.toJSON())})=>{
${repeatChar(' ', this.level)}${this.statements.map((statment) => {
      return `${repeatChar(' ', this.level)}${statment.toJSON()}`
    })
        .join('\n')}
${repeatChar(' ', this.level)}}`

  }
}

module.exports = Scope;