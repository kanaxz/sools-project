var utilities = require("../utilities");
var initWorker = {
	process: function(object, node, variables) {
		if (node.nodeType == Node.ELEMENT_NODE) {
			var initAttribute = node.getAttribute("init");
			if (initAttribute != null) {

				utilities.createFunctionWrapper(object, variables, initAttribute)();
				node.removeAttribute("init");
			}

		}
	}
}


module.exports = initWorker;