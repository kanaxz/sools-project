whitecrow.dnd.drag = (function() {
    var modeling = whitecrow.modeling;
    class drag extends whitecrow.control {

        constructor() {
            super();
            whitecrow.dnd.draggable({
                element: this,
                data: this.data,
                dataType:this.dataType,
                start: () => {
                    this.isDrag = true;
                },
                end: () => {
                    this.isDrag = false;
                }
            })
        }
    }

    return drag
        .properties({
            isDrag: {
                type: modeling.types.bool
            }
        })
        .define({
            breakScope: false,
            name: 'dnd-drag'
        })
})();