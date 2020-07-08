/**
  
	@memberof whitecrow
	@implements whitecrow.worker
*/
var attributeName = "on-property-changed";
var prefix = attributeName + ":";
var pathHelper = require("../pathHelper");
var utilities = require("../utilities");
var stringUtils = require("sools/string/utils");
const Variables = require("../render/Variables")
const synchronizer = require("../bind/synchronizer")

var watchs = []

var setWorker = {
	process: function(object, node, variables) {

		if (node.nodeType == Node.ELEMENT_NODE) {
			var setAttribute = node.getAttribute(attributeName);
			if (setAttribute != null) {
				var attrValue = setAttribute;

				stringUtils.processKeyValue(setAttribute, function(propertyPath, content) {
					propertyPath=  propertyPath.trim()
        	var watchCallback =()=>{
        		var vars = new Variables();
	       		vars.push(variables)
	        	vars.set(propertyPath, node[propertyPath]);
        		utilities.createFunctionWrapper(object, vars, content.trim())();	
        	}
        	synchronizer.watch(object,propertyPath,watchCallback)
        	watchs.push({
        		object,
        		node,
        		watchCallback
        	})
					
				},{
					delimiter:'=>'
				})
				
				node.removeAttribute(attributeName);
			}

		}
	}
}

module.exports = setWorker;