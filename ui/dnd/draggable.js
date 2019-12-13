 whitecrow.dnd.draggable = (function() {

    var currentOptions;
    var minDelta = 0;
    var lastPosition;
    var initialPosition;
    var isDrag = false;
    var isDragClassName = "dnd-is-drag";
    var delimiterClassName = "dnd-delimiter";
    var currentDelimiterElement;

    document.addEventListener('mouseover', function(event) {
        if (isDrag) {
            var dragEnterEvent = new CustomEvent("dndDragEnter", {
                bubbles: true,
                cancelable: false,
                detail: {
                    type: currentOptions.type,
                    data: currentOptions.data
                }
            })
            event.target.dispatchEvent(dragEnterEvent);
        }
    });

    window.addEventListener('mouseout', function(event) {

        if (isDrag) {
            var dragLeaveEvent = new CustomEvent("dndDragLeave", {
                bubbles: true,
                cancelable: false,
                detail: {
                    type: currentOptions.type,
                    data: currentOptions.data
                }
            })
            event.target.dispatchEvent(dragLeaveEvent);
        }
    });
    window.addEventListener('mousemove', function(event) {
        if (currentOptions != null) {
            var currentElement = currentOptions.element;
            var currentPosition = getRelativePosition(event, currentDelimiterElement);
            if (isDrag) {

                currentElement.style.left = currentPosition.x - initialPosition.x + "px";
                currentElement.style.top  = currentPosition.y - initialPosition.y + "px";
                lastPosition = currentPosition;
                var dragLeaveEvent = new CustomEvent("dndDragMove", {
                    bubbles: true,
                    cancelable: false,
                    detail: {
                        type: currentOptions.type,
                        data: currentOptions.data
                    }
                })

                event.target.dispatchEvent(dragLeaveEvent);
            }
            // here, 'lastPosition' is equivalent to mousedown event's position
            else if (whitecrow.math.getDistance(initialPosition, currentPosition) > minDelta) {
                currentElement.classList.add(isDragClassName);
                isDrag = true;
            }
        }
    }, true)

    window.addEventListener('mouseup', function() {
        if (currentOptions) {
            currentOptions.end();
            reset();
        }
    }, true)

    function getRelativePosition(event, element) {
        return {
            x: (event.clientX - element.offsetLeft),
            y: (event.clientY - element.offsetTop)
        }
    }

    function reset() {
        isDrag = false;
        currentOptions.element.style.top = "";
        currentOptions.element.style.left = "";
        currentOptions.element.classList.remove(isDragClassName);
        initialPosition = null;
        currentOptions = null;
        currentDelimiterElement.classList.remove(delimiterClassName);
        currentDelimiterElement = null;

    }

    function draggable(options) {
        whitecrow.event.on(options.element, "mousedown", function(event) {
            options.start();
            currentOptions = options;
            currentDelimiterElement = options.element.parentNode;
            initialPosition =  getRelativePosition(event, options.element);
            currentDelimiterElement.classList.add(delimiterClassName)
        });
    }

    return draggable;
})();