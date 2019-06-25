
module.exports = (base) => {
    class ArrayMixin extends base {

        get length() {
            return this.content.length;
        }

        set length(value) {
            this.content.length = value;
        }

        transform(array) {
            var copy = array.slice(0);
            copy.forEach((obj, index) => {
                this.defineIndexProperty(index);
            })
            return new Proxy(copy, {
                deleteProperty: (target, property) => {
                    if (property in target) {
                        var value = target[property];
                        delete target[property];
                        this.indexDeleted(property, value);
                    }
                    return true
                },
                set: (target, property, value) => {
                    var isIndex = !isNaN(parseInt(property));
                    if (isIndex) {
                        var oldValue = target[property]
                        this.settingIndex(property, value, oldValue);
                        target[property] = value;
                        this.indexSet(property, value, oldValue)
                    } else {
                        target[property] = value;
                    }
                    return true;
                }
            })

        }

        settingIndex(index, newValue, oldValue) {}

        indexSet(index, newValue, oldValue) {
            this.defineIndexProperty(index)
        }

        indexDeleted(index, value) {
            delete this[index]
        }

        getIndex(index){
            return this.content[index];
        }

        setIndex(index, value){
            this.content[index] = value;
        }

        defineIndexProperty(index) {
            if (!(index in this)) {
                Object.defineProperty(this, index, {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        return this.getIndex(index);
                    },
                    set: function(value) {
                        this.setIndex(index, value);
                    }
                });
            }
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

        [Symbol.iterator](){
            return this.content[Symbol.iterator]();    
        }
    }

    Object.getOwnPropertyNames(Array.prototype).forEach(function(name) {
        if (!(name in ArrayMixin.prototype) && name != "length") {
            Object.defineProperty(ArrayMixin.prototype, name, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: function(...args) {
                    return this.content[name](...args)
                }
            });
        }
    })

    return ArrayMixin;
}