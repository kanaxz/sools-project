const Watcher = require("./Watcher");
const Propertiable = require("sools/Propertiable");
class ObservableWatcher extends Watcher {

    static handle(object) {
        var dependencies = object.constructor.dependencies;
        return (dependencies && dependencies.has(Propertiable))
    }

    watch() {
        this.object.onPropertySet.listen(this.b(this.update));
    }

    unwatch() {
        this.object.onPropertySet.remove(this.b(this.update));
    }
}

module.exports = ObservableWatcher;