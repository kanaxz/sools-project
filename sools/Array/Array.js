var Base = require("../Base");
const rawMixin = require("./rawMixin");

module.exports = rawMixin(class Array extends Base{
    constructor(values) {
    	super();
        this.content = this.transform(values || []);
    }
    
    toJSON() {
        return this.content
    }
})