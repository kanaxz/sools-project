module.exports = class Proxy {

  apply(target) {
    throw new Error(`Cannot apply ${target.constructor.name}`)
  }

  deleteProperty(instance, property) {
    DELETE(instance[property])
  }
}