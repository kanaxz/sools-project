var BaseBinding = require("./BaseBinding");
var pathHelper = require("../pathHelper");
class Binding extends BaseBinding {
	constructor(object, variables, dest, nodePropertyPath, content) {
		super(object, variables, content);
		this.dest = dest;
		this.nodePropertyPath = nodePropertyPath;
		this.changed();
	}

	changed() {
		var result = this.getResult();
		
		pathHelper.set(this.dest, this.nodePropertyPath, result);
	}
}

module.exports = Binding;