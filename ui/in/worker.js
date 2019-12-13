var pathHelper = require("../pathHelper");
var inWorker = {
	process: function(object, node) {
		if (node.nodeType == Node.ELEMENT_NODE) {
			var inValue = node.getAttribute("in");
			if (inValue != null) {
				var array = pathHelper.get(object, inValue);
				if (!array)
					array = pathHelper.set(object, inValue, []);
				array.push(node);
			}
			node.removeAttribute("in");
		}
	}
}

module.exports = inWorker;