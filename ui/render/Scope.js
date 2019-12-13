var BaseScope = require("./BaseScope");
class Scope extends BaseScope {
	constructor(source) {
		super();
		this.source = source;
	}
}

module.exports = Scope;