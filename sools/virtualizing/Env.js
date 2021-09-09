const Global = require('./Global')
const Scope = require('./Scope')
const Env = {
  global: Global,
  process(fn) {
    console.log(this.global)
    const child = this.global._handler.scope.child()
    child.process(fn)
    return child
  }
}

Scope.Env = Env

module.exports = Env