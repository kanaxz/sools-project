const sools = require("sools");
var Control = require("sools-ui/Control")

module.exports = sools.define(Control, (base) => {
    class Field extends base {
    	constructor(model, property){
    		super();
    		this.model = model;
    		this.property = property;
    	}

    }
    return Field
})