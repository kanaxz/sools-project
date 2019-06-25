var Variables = require("./Variables");

class BaseScope {
	constructor() {
		this.variables = new Variables();
	}

	child() {
		return new ChildScope(this);
	}
}

class ChildScope extends BaseScope {

	constructor(parentScope) {
		super();
		this.parentScope = parentScope;
		this.variables.push(this.parentScope.variables);
	}

	get source() {
		return this.parentScope.source;
	}
}

module.exports = BaseScope;