var Expression = require(".");
var stringHelper = require("../stringHelper");
var expressions = [];
var attributeName = "expression";
var prefix = attributeName + ":";
var worker = {
	process: function(object, node, variables) {

		if (node.nodeType == Node.ELEMENT_NODE) {
			var expressionValue = node.getAttribute(attributeName);
			if (expressionValue != null) {
				var expression = new Expression(object, variables, node, "innerText", node.innerText.trim());
				expression.start();
				expressions.push(expression);
				node.removeAttribute(attributeName);
			}
			for (var i = 0; i < node.attributes.length; i++) {
				var attr = node.attributes[i];
				var clearContent = stringHelper.replaceStartOrNull(attr.name, prefix);
				if (clearContent != null) {
					var nodePropertyPath = stringHelper.attributeToJs(clearContent);

					var expression = new Expression(object, variables, node, nodePropertyPath, attr.value);
					expression.start();

					expressions.push(expression);
					node.removeAttribute(attr.name);
					--i;
				}
			}
		}
	},
	destroy: function(node) {
		if (node.nodeType == Node.ELEMENT_NODE) {
			for (var i = 0; i < expressions.length; i++) {
				var expression = expressions[i];
				if (expression.node == node) {
					expression.destroy();
					expressions.splice(i--, 1);
				}
			}
		}
	}
}

module.exports = worker;