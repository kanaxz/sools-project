const sools = require("sools");
const BindableFunctions = require("sools-define/BindableFunctions");
const NotImplemented = require("sools/errors/NotImplemented")

module.exports = sools.define([BindableFunctions()], (base) => {

    class Watcher extends base {

    	static handle(object){
    		throw new NotImplemented();
    	}

        constructor(object) {
            super();
            this.object = object;
            this.paths = [];
            this.watch();
        }

        watch(){
        	throw new NotImplemented();
        }

        unwatch(){
        	throw new NotImplemented();
        }

        destroy() {
            this.unwatch();
        }

        add(pathValue, callback) {
            var path = this.getPath(pathValue);
            if (path) {
                path.callbacks.push(callback);
            } else {
                this.paths.push({
                    value: pathValue,
                    callbacks: [callback]
                });

            }
        }

        remove(pathValue, callback) {
            var pathIndex = this.getPathIndex(pathValue);
            if (pathIndex != -1) {
                var path = this.paths[pathIndex];
                var callbackIndex = path.callbacks.indexOf(callback);

                if (callbackIndex != -1) {
                    //console.log("callback found", this.object, pathValue)
                    path.callbacks.splice(callbackIndex, 1);
                    if (path.callbacks.length === 0) {
                        path.callbacks = null;
                        path.value = null;
                        this.paths.splice(pathIndex, 1);
                    }
                }
            }
        }

        getPathIndex(pathValue) {
            for (var i = 0; i < this.paths.length; i++) {
                var path = this.paths[i];
                if (path.value === pathValue)
                    return i
            }
            return -1;
        }

        getPath(pathValue) {
            var pathIndex = this.getPathIndex(pathValue);
            if (pathIndex != -1) {
                return this.paths[pathIndex];
            } else
                return null;
        }

        /**
         * @param {string} [param=null]
         */
        update(param) {
            var self = this;
            if (param instanceof Array) {

                param.forEach(function(pathValue) {
                    self.update(pathValue);
                })
            } else {
                var pathValue = param;
                var clonedPaths = this.paths.slice(0);
                for (var i = 0; i < clonedPaths.length; i++) {
                    var path = clonedPaths[i];
                    if (pathValue == null ||
                        (path.value != null &&
                            ((path.value.length == pathValue.length &&
                                    path.value == pathValue) ||
                                (path.value.length > pathValue.length &&
                                    path.value.startsWith(pathValue + "."))))) {
                        var cloneCallbacks = path.callbacks.slice(0);
                        for (var j = 0; j < cloneCallbacks.length; j++) {
                            var callback = cloneCallbacks[j];
                            callback(0);
                        }
                    }
                }
            }

        }
    }
    return Watcher;
})