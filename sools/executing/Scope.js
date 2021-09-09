const Source = require("../virtualizing/Source")
const Sources = require("../virtualizing/Source/enum")
const Virtual = require("./Virtual")

module.exports = class Scope {
  constructor(source) {
    this._source = source;
    this.parent = null;
    this.values = [];
    this.caches = [];
  }

  get source() {
    return this._source || this.parent.source
  }

  async getValue(arg, target) {
    if (!arg) {
      return null
    }
    var cache = this.caches.find((cache) => cache.handler == arg);
    var value;
    if (cache) {
      value = cache.value;
    }
    else {
      value = await (async () => {
        if (arg.source instanceof Sources.functionCall) {
          return await this.source.processFunctionCall(this, arg.source)
        }
        else if (arg.source instanceof Sources.dynamicFunction) {
          return arg.source;
        }
        else if (arg.source instanceof Sources.array) {
          var result = [];
          for (var value of arg.source.values)
            result.push(await this.getValue(value))
          return result;
        }
        else if (arg.source instanceof Sources.value) {
          return arg.source.value;
        }
        else if (!(arg.source instanceof Source)) {
          return arg.source
        }
        else if (arg.source instanceof Sources.values) {
          var result = {};
          for (var p in arg.source) {

            result[p] = await this.getValue(arg.source[p]);
          }
          return result
        }
        else if (arg.source instanceof Sources.property) {
          var parent = await this.getValue(arg.source.source, Virtual)
          if (parent.isVirtual)
            return parent.getProperty(arg.source.path)
          else
            return parent[arg.source.path]
        }
        else if (arg.source instanceof Sources.var) {
          var pair = this.getPair(arg)
          if (!pair) {
            debugger
            throw new Error("Pair not found")
          }
          return pair.value
        }
        else
          return arg.source
      })();

      this.caches.push({
        handler: arg,
        value
      })
      /**/
    }
    if (value instanceof Virtual && !(target && value instanceof target)) {
      value = await value.getValue(this)
    }
    return value
  }

  getPair(arg) {
    var pair = this.values.reverse().find((kv) => {
      if (!arg || !kv.arg)
        debugger
      return kv.arg.source == arg.source
    });
    if (pair)
      return pair
    return this.parent && this.parent.getPair(arg);
  }

  setValue(arg, value) {
    if (!arg) {
      debugger
      throw new Error()
    }
    this.values.push({ arg, value });
  }

  replaceValue(arg, value) {
    var pair = this.getPair(arg);
    if (pair)
      pair.value = value;
    var cache = this.caches.find((cache) => cache.handler == arg);
    if (cache)
      cache.value = value;
  }

  async process(vscope) {
    for (var functionCall of vscope.statements) {
      if (functionCall.function.name == "return") {
        return await this.source.processFunctionCall(this, functionCall);
      }
      else {
        await this.source.processFunctionCall(this, functionCall);
      }
    }
  }


  child() {
    var child = new Scope();
    child.parent = this;
    return child;
  }
}
