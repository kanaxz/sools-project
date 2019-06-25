const Index = require("./Index");
const sools = require("sools");

module.exports = sools.define((base) => {
    class Index extends base {
        constructor(...propertyNames) {
        	super();
            this.propertyNames = propertyNames;
        }
    }

    return Index;
})