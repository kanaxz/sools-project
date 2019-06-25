'use strict';
var BaseBinding = require("../bind/BaseBinding");
class ExpressionBinding extends BaseBinding {
	constructor(expression, object, variables, content) {
		super(object, variables, content);
		this.expression = expression;
	}
	changed() {
		this.expression.changed();
	}
}

module.exports = ExpressionBinding;