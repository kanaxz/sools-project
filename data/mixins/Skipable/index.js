var sools = require("sools")
var Queryable = require("../Queryable");
const Skip = require("./Skip");
module.exports = sools.mixin([Queryable()], (base) => {

    class Skipable extends base {
    	skip(skip){
    		return this.operation(new Skip(skip));
    	}
    }

    return Skipable;
})