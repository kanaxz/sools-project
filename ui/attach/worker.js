var PropertyPath = require("../PropertyPath");
var pathHelper = require("../pathHelper");
const ATTACH = "attach";
var attachedWorker = {
	process: function(object, node, variables) {
		if (node.nodeType == Node.ELEMENT_NODE) {
			var as = node.getAttribute("as");
			var path;
			var obj;
			if (as != null) {
				if (as.indexOf(".") != -1) {
					var asPath = new PropertyPath(as);
					obj = asPath.getOrigin(object, variables);
					path = asPath.getPath(1);
				} else {
					path = as;
					obj = object;
				}
				node.removeAttribute("as");

			} else if (node.id && node.getAttribute(ATTACH) != null) {
				obj = object;
				path = node.id || node.name;
				node.removeAttribute(ATTACH);
			}
			if (obj && path)
				pathHelper.set(obj, path, node);
		}
	}
}
module.exports = attachedWorker;