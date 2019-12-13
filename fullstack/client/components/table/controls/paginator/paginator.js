define(['whitecrow'], function(whitecrow) {
    var modeling = whitecrow.modeling;
    class paginator extends whitecrow.control {

        constructor() {
            super();
            this.currentIndex = 0;
            this.pagesIndexesArray = null;
        }

        update() {
            var pagesIndexesArray = [];
            for (var i = Math.max(this.currentIndex - 2, 0); i < Math.min(this.currentIndex + 3, this.pagesCount); i++) {
                pagesIndexesArray.push(i);
            }
            this.pagesIndexesArray = pagesIndexesArray;
        }

        pageIndexClicked(index) {
            this.currentIndex = index;
            var event = new CustomEvent('indexChanged', {
                bubbles: false,
                cancelable: false,
                detail: {
                    index: index
                }
            })
            this.dispatchEvent(event);
        }
    }

    return paginator
        .properties({
            pagesCount:{
                type:modeling.types.number,
                change:function(){
                    this.update();
                }
            },
            pagesIndexesArray: {
                type: modeling.types.array
            },
            currentIndex: {
                type: modeling.types.number,
                change:function(){
                    this.update();
                }
            }
        })
        .define({
            name: "table-paginator",
            templateUrl: "components/table/controls/paginator/paginator.html"
        });
})