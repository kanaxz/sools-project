/**
  
	@memberof whitecrow
	@implements whitecrow.worker
*/
var attributeName = "set";
var prefix = attributeName + ":";
var pathHelper = require("../pathHelper");
var utilities = require("../utilities");
var setWorker = {
	process: function(object, node, variables) {

		if (node.nodeType == Node.ELEMENT_NODE) {
			var setAttribute = node.getAttribute(attributeName);
			if (setAttribute != null) {
				var attrValue = setAttribute;
				if (attrValue.indexOf("return") == -1)
					attrValue = "return " + attrValue;
				
				
				var values = utilities.createFunctionWrapper(object, variables, attrValue)();
				for (var propertyName in values) {
					var value = values[propertyName];
					
					pathHelper.set(node, propertyName, value);
				}
				node.removeAttribute(attributeName);
			}

		}
	}
}

module.exports = setWorker;