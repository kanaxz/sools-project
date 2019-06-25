var listeners = [];

var event = {
    on: function(element, eventName, handler, useCapture) {
        element.addEventListener(eventName, handler, useCapture);
        listeners.push({
            element: element,
            handler: handler,
            eventName: eventName
        })
    },
    destroy: function(element) {
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            if (listener.element == element) {
                element.removeEventListener(listener.eventName, listener.handler);
                listeners.splice(i--, 1);
            }
        }
    }
};

module.exports = event;