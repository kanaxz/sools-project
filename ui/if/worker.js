var utilities = require("../utilities");
var ifWorker = {
	process: function(object, node, variables) {

		if (node.nodeType == Node.ELEMENT_NODE) {

			var ifAttribute = node.getAttribute("if");
			if (ifAttribute != null) {
				var fnContent = ifAttribute;
				if (fnContent.indexOf("return") == -1)
					fnContent = "return " + fnContent;
				var result = utilities.createFunctionWrapper(object, variables, fnContent)();
				node.removeAttribute("if");
				if (!result) {
					node.parentNode.removeChild(node);

					return false;
				}

			}


		}
	}
}

module.exports = ifWorker;