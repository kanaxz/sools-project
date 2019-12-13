var Tree = require("../Tree");
var sools = require("../sools");
module.exports = sools.define(Tree, (base) => {

    class Scope extends base {
    	
	    get(type) {
	        return this.find((c) => {
	            return c instanceof type
	        })
	    }
    }

    return Scope;
})