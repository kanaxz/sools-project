var BaseBinding = require("../bind/BaseBinding")
class ClassBinding extends BaseBinding {
	constructor(object, variables, node, className, content) {
		super(object, variables, content);
		this.node = node;
		this.className = className;
		this.changed();
	}

	changed() {

		var result = this.getResult();
		if (result)
			this.node.classList.add(this.className)
		else
			this.node.classList.remove(this.className);
	}
}

module.exports = ClassBinding;