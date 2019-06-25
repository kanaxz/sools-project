var attributeName = "bind:class";
var bindings = [];
var binder = require("./binder");
var stringHelper = require("sools/string/utils");
var classWorker = {

    process: function(object, node, variables) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            var bindAttribute = node.getAttribute(attributeName);
            if (bindAttribute != null) {
                var bindings = stringHelper.processKeyValue(bindAttribute, function(className, content) {
                    className = className.trim();
                    binder.createBinding(object, variables, node, className, content.trim())
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

module.exports = classWorker;