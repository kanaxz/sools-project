var sools = require("sools")
var Queryable = require("../Queryable");
var mixin = sools.mixin([Queryable()], (base) => {

    class Includeable extends base {
        include(include, fn) {
            if (!(include instanceof mixin.include)) {
                var split = include.split(".");
                include = new mixin.include(split[0]);
                var current = include;
                for (var i = 1; i < split.length; i++) {
                    var segment = split[i];
                    var sub = new mixin.include(segment)
                    current.include(sub);
                    current = sub;
                }
                if (fn)
                    fn(current);
            }
            return this.operation(include);
        }
    }

    return Includeable;
})

module.exports = mixin;