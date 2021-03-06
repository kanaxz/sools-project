var arrayUtilities = {
    isIterable: (obj) => {
        return typeof obj[Symbol.iterator] === 'function';
    },
    chain: (array, fn, final, args) => {
        var it = (index, ...args) => {
            if (index < array.length) {
                var obj = array[index];
                return fn(obj, (...subArgs) => {
                    return it(index + 1, ...subArgs);
                }, ...args);
            } else {
                return final(...args);
            }
        }
        return it(0, ...(args || []));
    },
    chainBackward: (array, fn, final, options) => {
        options = options || {};
        options.backward = true;
        return arrayUtilities.chain(array, fn, final, options);
    },
    forEachAsync: function(array, it) {
        var work = function(i) {
            if (i < array.length) {
                return Promise.resolve(it(array[i])).then(() => {
                    return work(i + 1)
                })
            } else {
                return Promise.resolve(0);
            }
        }
        return work(0);
    },
    findOrLast(source, findFn) {
        for (var i = 0; i < source.length; i++) {
            var object = source[i];
            if (findFn(object) || i + 1 == source.length)
                return object;
        }
        return (null);
    }
}

module.exports = arrayUtilities;