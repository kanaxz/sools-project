whitecrow.dnd.droppable = (function() {
    function droppable(options) {

        var dragCount = 0;
        whitecrow.event.on(options.element, "dndDragEnter", function(event) {
            event.stopPropagation();
            dragCount++;
            if (dragCount == 1) {
                if (options.enter) {
                    options.enter(event);
                }
            }

        });

        whitecrow.event.on(options.element, "dndDragLeave", function(event) {
            event.stopPropagation();
            dragCount--;
            if (dragCount == 0) {
                if (options.leave) {
                    options.leave(event);
                }
            }
        });

        whitecrow.event.on(options.element, "dndDragMove", function(event) {
            event.stopPropagation();
            if(options.dragMove){
                options.dragMove(event);
            }
        });

        if (options.handled) {
            whitecrow.event.on(options.element, "drophandled", function(event) {
                options.handled(event);
            });
        }


        whitecrow.event.on(options.element, "drop", function(event) {
            event.preventDefault();
            dragCount = 0;
            var data = JSON.parse(event.dataTransfer.getData("text"));
            var detail = {
                dropEvent: event,
                data: data.value
            };
            var resultEvent;
            if (data.type == options.dataType) {
                resultEvent = new CustomEvent("dropHandled", {
                    bubbles: true,
                    cancelable: false,
                    detail: detail
                })
            } else {
                resultEvent = new CustomEvent("dropUnhandled", {
                    bubbles: true,
                    cancelable: false,
                    detail: detail
                })
            }

            options.element.dispatchEvent(resultEvent)

            if (options.drop) {
                options.drop(event);
            }

        });

        options.element.__dndDropable__ = true;
    }

    return droppable;
})();