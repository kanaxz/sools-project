var sools = require("sools")
var Queryable = require("../Queryable");
const Limit = require("./Limit");
const First = require("./First");
module.exports = sools.mixin([Queryable()], (base) => {

    class Limitable extends base {
    	limit(limit){
    		return this.operation(new Limit(limit));
    	}

    	first(){
    		return this.operation(new First());	
    	}
    }

    return Limitable;
})