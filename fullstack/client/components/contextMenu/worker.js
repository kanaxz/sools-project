const ContextMenu = require("./contextMenu");
const utilities = require("sools-ui/utilities");
const renderer = require("sools-ui/render/renderer");
const event = require("sools-ui/event");
var attributeName = "context-menu";
var currentContextMenu;
var activeClass = "context-menu-open";

var closeFunction = function() {
    if (currentContextMenu) {

        currentContextMenu.node.classList.remove(activeClass);
        renderer.destroy(currentContextMenu);
        document.body.removeChild(currentContextMenu);
        currentContextMenu = null;
    }
}
window.addEventListener("keyup", function(e) {
    if (e.keyCode == 27) //escape
        closeFunction();
}, true)
window.addEventListener("contextmenu", closeFunction, true);
window.addEventListener("click", closeFunction);

var worker = {
    process: function(object, node, variables) {

        if (node.nodeType == Node.ELEMENT_NODE) {
            var attribute = node.getAttribute(attributeName);
            if (attribute != null) {
                if (attribute.indexOf("return") == -1)
                    attribute = "return " + attribute;

                var contextMenuDatas = utilities.createFunctionWrapper(object, variables, attribute)();
                event.on(node, "contextmenu", function(e) {
                    e.preventDefault();
                    var control = new ContextMenu(e, node, contextMenuDatas);
                    currentContextMenu = control;
                    document.body.appendChild(control);
                    node.classList.add(activeClass);
                    currentContextMenu.attach();
                })
                node.removeAttribute(attributeName);
            }
        }
    },
    destroy: function() {

    }
}


module.exports = worker;