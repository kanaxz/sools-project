const sools = require("../../sools");

module.exports = sools.mixin((base) => {
    class Identity extends base{
        constructor(...propertyNames) {
        	super();
            this.propertyNames = propertyNames;
        }

        build(object){
        	
        }
    }
    return Identity;
})