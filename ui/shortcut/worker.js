/**
  
	@memberof whitecrow
	@implements whitecrow.worker
*/
var prefix = "sc:";
var pathHelper = require("../pathHelper");
var stringHelper = require("../stringHelper");
var shortcutWorker = {
    process: function(object, node, variables) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            for (var i = 0; i < node.attributes.length; i++) {
                var attr = node.attributes[i];
                var nodePropertyPath = stringHelper.replaceStartOrNull(attr.name, prefix);
                if (nodePropertyPath != null) {
                    (function(npp) {
                        Object.defineProperty(object, attr.value, {
                            get: function() {
                                return pathHelper.get(node, npp);
                            },
                            set: function(value) {
                                pathHelper.set(node, npp, value);
                            }
                        })
                    })(nodePropertyPath);

                    node.removeAttribute(attr.name);
                    --i;
                }
            }
        }
    }
}

module.exports = shortcutWorker;