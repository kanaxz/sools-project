var sools = require("../sools")
var Components = require("./Components");
module.exports = sools.mixin((base) => {
    
    class Componentable extends base {

    	constructor(...args){
    		super(...args);
    		this.components = new Components();
    	}


    }

    return Componentable;
})