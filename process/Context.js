var Tree = require("sools/Tree");
var sools = require("../sools");
module.exports = sools.define(Tree, (base) => {

    class Context extends base {
    	 getAll(type) {
	        return this.filter((c) => {
	            return c instanceof type;
	        })
	    }

	    get(type) {
	        return this.find((c) => {
	            return c instanceof type
	        })
	    }
    }

    return Context;
})