var BaseBinding = require("./BaseBinding");
var pathHelper = require("../pathHelper");
class Binding extends BaseBinding {
	constructor(object, variables, node, nodePropertyPath, content) {
		super(object, variables, content);
		this.node = node;
		this.nodePropertyPath = nodePropertyPath;
		this.changed();
	}

	changed() {
		var result = this.getResult();
		//console.log("changed", this.nodePropertyPath, result)
		pathHelper.set(this.node, this.nodePropertyPath, result);
	}
}

module.exports = Binding;