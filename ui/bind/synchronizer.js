const ObservableWatcher = require("./watchers/Observable");

var prv = {
    watcherTypes: [],
    watchers: [],
    getWatchedByObject: function(object) {
        return this.watchers.find((watchedObject) => {
            return watchedObject.object == object;
        })
    },
    removeWatched: function(object) {
        var index = this.watchers.indexOf(object);
        if (index != -1)
            this.watchers.splice(index, 1)
    },
    findWatcherType: function(object) {
        return this.watcherTypes.find((watcherType) => {
            return watcherType.handle(object);
        })
    }
};

var pblc = {
    watcher: (watcherType) => {
        prv.watcherTypes.push(watcherType)
    },
    watch: function(object, path, callback) {
        var watcher = prv.getWatchedByObject(object);
        if (!watcher) {
            var watcherType = prv.findWatcherType(object);
            if (!watcherType){
                throw new Error("Watcher type not found");
            }
            watcher =new watcherType(object);
            prv.watchers.push(watcher);
        }
        watcher.add(path, callback);
    },
    unwatch: function(object, path, callback) {
        
        var watchedObject = prv.getWatchedByObject(object);
        if (watchedObject) {
            watchedObject.remove(path, callback);
            if (watchedObject.paths.length == 0) {
                watchedObject.destroy();
                prv.removeWatched(watchedObject);
            }

        }
    }
};

window.synchronizer = prv;
pblc.watcher(ObservableWatcher);

module.exports = pblc;