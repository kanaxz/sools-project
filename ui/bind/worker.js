var bindings = [];
var attributeName = "bind";
var binder = require("./binder");
var stringUtils = require("sools/string/utils");
var bindWorker = {
    process: function(object, node, variables) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            var bindAttribute = node.getAttribute(attributeName);
            if (bindAttribute != null) {
                var bindings = stringUtils.processKeyValue(bindAttribute, function(propertyPath, content) {
                    binder.createBinding(object, variables, node, propertyPath.trim(), content.trim())
                });
                node.removeAttribute(attributeName);
            }
        }
    },
    destroy: function(node) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            binder.destroy(node);
        }
    }
}

module.exports = bindWorker;