var event = require(".");
var stringHelper = require("sools/string/utils");
const utils = require("sools-browser/utils");;
var utilities = require("../utilities");
var suffixes = {
    prevent: function(event) {
        event.preventDefault();
        return true;
    },
    propagation: function(event) {
        event.stopPropagation();
    }
}

var prefix = "on:";
var eventWorker = {

    eventBindings: [],
    process: function(source, node, variables) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            for (var i = 0; i < node.attributes.length; i++) {
                var attr = node.attributes[i];
                var eventValue = stringHelper.replaceStartOrNull(attr.name, prefix);
                if (eventValue != null) {
                    var splittedEventValue = eventValue.split(".");
                    var eventName = splittedEventValue[0];
                    eventName = utils.attributeToJs(eventName);
                    (function(fnContent, ev) {
                        var listener = function(event) {
                            var shouldContinue = true;
                            for (var i = 1; i < splittedEventValue.length; i++) {
                                var eventValueSegment = splittedEventValue[i];
                                if (!suffixes[eventValueSegment](event)) {
                                    shouldContinue = false;
                                    break;
                                }
                            }
                            if (shouldContinue) {
                                if (fnContent != "") {
                                    variables["event"] = event;
                                    var userListener = utilities.createFunctionWrapper(source, variables, fnContent);
                                    userListener();
                                }
                            }
                        }
                        event.on(node, ev, listener, splittedEventValue.indexOf("capture") != -1);
                    })(attr.value, eventName);
                    node.removeAttribute(attr.name);
                    i--;
                }
            }
        }
    },
    destroy: function(node) {
        event.destroy(node);
    }
}

module.exports = eventWorker;