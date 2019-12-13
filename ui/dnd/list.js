whitecrow.dnd.list = (function() {
    var modeling = whitecrow.modeling;


    var orientations = {
        vertical: 'vertical',
        horizontal: 'horizontal'
    }

    function defaultDataPicker(item) {
        return item;
    }

    function defaultCompareData(i1, i2) {
        return i1 == i2;
    }

    class list extends whitecrow.controls.list {

        constructor() {
            super();
            this.shouldInsertBefore = false;
            this.orientation = orientations.vertical;
            this.dropOverItemDatas = null;
        }
        set items(val) {
            super.items = val;
        }

        get items() {
            return super.items;
        }

        afterProcessing(event) {

            super.afterProcessing(event);
            var dataType = this.dataType || this.itemName;
            whitecrow.event.on(this, "mouseleave", () => {
                this.reset();
            });



            whitecrow.dnd.droppable({
                element: this.placeHolder,
                dataType: dataType,
                handled: (event) => {
                    var compareData = this.compareData || defaultCompareData;
                    var dropItem = event.detail.data;
                    var newIndex = this.dropOverItemDatas.it.index + (this.shouldInsertBefore ? 0 : +1);
                    this.items.splice(newIndex, 0, dropItem);
                    this.reset();
                }
            })
        }

        reset() {
            var container = this.getElementsContainer();
            this.dropOverItemDatas = null;
            if (this.placeHolder.parentNode == container)
                container.removeChild(this.placeHolder);
        }

        itemInitialized(itemDatas) {
            var dataType = this.dataType || this.itemName;
            var item = itemDatas.item;
            itemDatas.it.set("isDrag", false);
            var element = itemDatas.element;
            var selectData = this.dataPicker || defaultDataPicker;
            whitecrow.dnd.draggable({
                element: element,
                dataType: dataType,
                data: selectData(item, this),
                start: () => {
                    this.dragItemDatas = itemDatas;
                    itemDatas.it.isDrag = true;
                },
                end: () => {
                    itemDatas.it.isDrag = false;
                }
            });

            whitecrow.event.on(element, "dndDragMove", (event) => {
                this.dropOverItemDatas = itemDatas;


                if (this.orientation == orientations.vertical) {
                    this.shouldInsertBefore = (event.clientY - element.offsetTop) < (element.offsetHeight / 2);
                } else {
                    this.shouldInsertBefore = (event.clientX - element.offsetLeft) < (element.offsetWidth / 2);
                }
                if (!this.shouldInsertBefore) {

                    if (itemDatas.it.index != this.items.length - 1) {
                        var next = this.itemsDatas.find(function(id) {
                            return id.it.index == itemDatas.it.index + 1;
                        })
                        this.insertBefore(this.placeHolder, next.element);
                    } else {
                        this.appendChild(this.placeHolder);
                    }

                } else {
                    this.insertBefore(this.placeHolder, element);
                }

            });
        }

    }

    return list
        .define({
            name: 'dnd-list'
        })
})();