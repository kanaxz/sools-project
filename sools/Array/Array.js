const Event = require("../Event")

module.exports = new Proxy(class extends Array {

  constructor(...args) {
    super(...args);
    this.onIndexDeleted = new Event();
    this.onIndexSet = new Event();
  }
  remove(object) {
    var result = this.tryRemove(object);
    if (!result)
      throw new RangeError();
  }

  tryRemove(object) {
    var index = this.indexOf(object);
    if (index != -1) {
      this.splice(index, 1)
      return true;
    } else
      return false;
  }

  indexDeleted(...args) {
    this.onIndexDeleted.trigger(...args);
  }

  indexSet(...args) {
    this.onIndexSet.trigger(...args);
  }
  settingIndex(index, value, oldValue) {

  }

}, {
  construct: (target, args) => {
    return new Proxy(new target(...args), {
      deleteProperty: (target, property) => {
        if (property in target) {
          var value = target[property];
          delete target[property];
          target.indexDeleted(property, value);
        }
        return true
      },
      set: (target, property, value) => {
        
        var isIndex = !isNaN(parseInt(property));
        if (isIndex) {
          var oldValue = target[property]
          target.settingIndex(property, value, oldValue);
          target[property] = value;
          target.indexSet(property, value, oldValue)
        } else {
          target[property] = value;
        }
        return true;
      }
    })
  }
})