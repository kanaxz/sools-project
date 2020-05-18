const sools = require("sools");
const BindableFunctions = require("sools/BindableFunctions");
const Handler = require("../Handler");
const Array = require("sools/Array");
const It = require("./It");
const renderer = require("../../../../render/renderer")
const arrayUtils = require("sools/Array/utils");


module.exports = sools.define(Handler, [BindableFunctions()], (base) => {
  class ObservableArrayHandler extends base {
    static handle(source) {
    	console.log("why not",source)
      var constructor = source.constructor;
      return source instanceof Array
    }

    constructor(repeater, source) {
      super(repeater, source);
      this.modifs = [];
      this.source.onIndexDeleted.listen(this.b(this.onIndexDeleted));
      this.source.onIndexSet.listen(this.b(this.onIndexSet));
    }

    delete() {
      var firstModif = this.modifs[0];
      this.repeater.destroyIteration(firstModif.old);
      for (var modif of this.modifs) {
        modif.new.index--;
      }
      this.modifs = [];
    }

    swap() {
      console.log("SWAPING", this.modifs)
      return
      for (var modif of this.modifs) {
        this.replace(modif.new);
      }

      this.modifs = [];
    }

    insert() {
      console.log("insert");
      for (var modif of this.modifs) {
        modif.new.index = modif.index;
      }
      this.repeater.processIteration(modif.new);
      this.insertIteration(modif.new);
      this.modifs = [];
    }

    insertIteration(it) {
      var next = this.repeater.iterations.find((subIt) => {
        return subIt.index == it.index + 1
      })
      if (!next)
        throw new Error("Next not found")
      this.repeater.container.insertBefore(it.element, next.element);
      renderer.render(it.element, it.scope);
    }

    replace(it) {
      it.element.parentNode.removeChild(it.element);
      if (it.index == this.source.lentgh - 1) {
        this.repeater.container.appendChild(it.element);
      } else {
        var next = this.repeater.iterations.find((subIt) => {
          return subIt.index == it.index + 1
        })

        this.repeater.container.insertBefore(it.element, next.element);
      }
    }

    onIndexDeleted(index, object) {
      var it = this.repeater.iterations.find((it) => {
        return it.object == object;
      })
      if (this.modifs.length) {
        var lastModif = this.modifs[this.modifs.length - 1];
        if (lastModif.new == it) {
          this.delete();
        }
      } else {
        this.repeater.destroyIteration(it);
      }
    }

    onIndexSet(index, newValue, oldValue) {
      console.log("index set");
      var existingIteration = this.repeater.iterations.find((it) => {
        return it.object == newValue;
      })
      if (oldValue) {
        var oldIteration = this.repeater.iterations.find((it) => {
          return it.object == oldValue;
        })

        if (existingIteration) {
          this.modifs.push({
            new: existingIteration,
            old: oldIteration,
            index: index
          })
          var firstModif = this.modifs[0];
          if (firstModif && firstModif.old == existingIteration) {
            this.swap();
          } else {

          }

        } else {
          if (oldIteration) {
            var newIt = this.repeater.processIteration(new It({
              object: newValue
            }));
            this.modifs.push({
              new: newIt,
              old: oldIteration,
              index: index
            })

            this.insert();

          }
        }
      } else {
        if (existingIteration) {
          this.modifs.push({
            new: existingIteration,
            index: index
          })
        } else {
          this.repeater.processAndInsertIteration(new It({
            index,
            object: newValue
          }))
        }
      }

    }


    forEach(fn) {
      return arrayUtils.forEachAsync(this.source, (object, index) => {
        var it = new It({
          object,
          index
        })
        return fn(it);
      })
    }

    destroy() {
      this.source.onIndexDeleted.remove(this.b(this.onIndexDeleted));
      this.source.onIndexSet.remove(this.b(this.onIndexSet));
    }
  }

  return ObservableArrayHandler;
})