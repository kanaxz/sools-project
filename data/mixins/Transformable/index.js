var sools = require("sools")
var Queryable = require("../Queryable");
module.exports = sools.mixin([Queryable()], (base) => {

    class Transformable extends base {
   
    }

    return Transformable;
})