var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
module.exports = {
  getParamNames: function (func) {
    if (!func)
      debugger
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
      result = [];
    let eraseMode = false
    for (let i = 0; i < result.length; i++) {
      const argName = result[i]
      if (argName === '{') {
        eraseMode = true
      }
      if (eraseMode) {
        result.splice(i--, 1)
        if (argName === '}') {
          eraseMode = false
          result.splice(i, 0, null)
        }
      }
    }
    return result;
  },
  getParamName: function (func) {
    return this.getParamNames(func)[0];
  }
}