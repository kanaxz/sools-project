const Global = require('./Global')
const Scope = require('./Scope')
const This = require('./Virtual/enum/This')
const Var = require('./Source/enum/Var')

const Env = {
  global: Global._handler,
  process(fn, args) {
  
    const child = this.global.scope.child()
    child.process(fn, args)
    return child
  }
}

Scope.Env = Env

module.exports = Env