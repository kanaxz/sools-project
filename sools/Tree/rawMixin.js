module.exports = (base) => {
    class Tree extends base {

        push(...objs) {
            this.content.push(...objs);
        }

        remove(...objs) {

        }

        forEach(fn) {
            for (var object of this) {
                fn(object);
            }
        }

        find(fn) {
            for (var obj of this) {
                if (fn(obj))
                    return obj;
            }
            return null;
        }

        filter(fn) {
            var result = [];
            for (var obj of this) {
                if (fn(obj)) {
                    result.push(obj);
                }
            }
            return result;
        }

        map(fn){
            var result = [];
            for(var obj of this){
                result.push(fn(obj));
            }
            return result;
        }
    }

    Tree.prototype[Symbol.iterator] = function() {
        var it = {
            tree: this,
            index: 0,
            it: null
        };
        return {
            next: () => {
                return getNext(it);
            }
        }
    }


    function getNext(it) {
        var obj = it.tree.content[it.index];
        var value;
        

        if (obj instanceof it.tree.constructor) {
            if (!it.it)
                it.it = obj[Symbol.iterator]();
            var result = it.it.next();
            if (result.done) {
                it.index++;
                it.it = null;
                return getNext(it)
            } else {
                value = result.value;
            }
        } else {
            value = it.tree.content[it.index++];
        }
        return {
            value: value,
            done: it.index > it.tree.content.length
        }
    }

    return Tree;
}