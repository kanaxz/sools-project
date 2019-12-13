whitecrow.dnd.drop = (function() {
    var modeling = whitecrow.modeling;
    class drop extends whitecrow.control {


        afterProcessing(event) {
        	super.afterProcessing(event);
            whitecrow.dnd.droppable({
                element: this,
                dataType: this.dataType,
                enter: () => {
                    this.isDragOver = true;
                },
                leave: () => {
                    this.isDragOver = false;
                },
                drop: () => {
                    this.isDragOver = false;
                }
            })
        }

    }

    return drop
        .properties({
            isDragOver: {
                type: modeling.types.bool
            }
        })
        .define({
            breakScope: false,
            name: 'dnd-drop'
        })
})();