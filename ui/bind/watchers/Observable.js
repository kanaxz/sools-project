const Watcher = require("./Watcher");
const Observable = require("sools-define/Propertiable");
class ObservableWatcher extends Watcher {

    static handle(object) {
        var dependencies = object.constructor.dependencies;
        return (dependencies && dependencies.has(Observable))
    }

    watch() {
        this.object.onPropertySet.listen(this.b(this.update));
    }

    unwatch() {
        this.object.onPropertySet.remove(this.b(this.update));
    }
}

module.exports = ObservableWatcher;