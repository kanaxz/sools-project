/**
  
	@memberof whitecrow
	@implements whitecrow.worker
*/
var attributeName = "set";
var prefix = attributeName + ":";
var pathHelper = require("../pathHelper");
var utilities = require("../utilities");
var stringUtils = require("sools/string/utils");
var binder = require("../bind/binder");
var classBinder = require("../class/binder");
var setWorker = {
	process: function(object, node, variables) {
		if (node.nodeType == Node.ELEMENT_NODE) {
			var setAttribute = node.getAttribute(attributeName);
			if (setAttribute != null) {
				var attrValue = setAttribute;
				
				stringUtils.processKeyValue(setAttribute, function(propertyPath, content) {
					propertyPath = propertyPath.trim()
					content = content.trim();

					if(propertyPath == "class"){
 						stringUtils.processKeyValue(content, function(className, subContent) {
                classBinder.createBinding(object, variables, node, className.trim(), subContent.trim())
            });
					}
					/*
					else if(propertyPath == "styles"){
						stringUtils.processKeyValue(content, function(styleName, subContent) {
               binder.createBinding(object, variables, node, "styles." + styleName.trim(), subContent.trim())
            });
					}
					/**/
					else if(content.indexOf("@") != -1){
						binder.createBinding(object, variables, node, propertyPath, content)
					}
					else{
						
						if(content.indexOf("return"))
							content = "return " + content

						var value = utilities.createFunctionWrapper(object, variables, content)();
						pathHelper.set(node, propertyPath, value); 
					}
        });
				node.removeAttribute(attributeName);
			}

		}
	}
}

module.exports = setWorker;