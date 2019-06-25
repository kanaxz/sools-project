var Base = require("../Base");
var rawMixin = require("./rawMixin");
module.exports = rawMixin(class Tree extends Base{
    constructor(...values) {
    	super();
        this.content = values;
    }
});