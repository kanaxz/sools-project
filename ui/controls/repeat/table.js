var htmlHelper = require("../htmlHelper");
var BaseRepeater = require("./BaseRepeater")
var renderer = require("../rendering/renderer");
class Table extends BaseRepeater {
    /*
    	@protected override
    */
    initialize() {
        renderer.renderContent(this, this).then(nop => {
            while (this.firstChild)
                this.removeChild(this.firstChild);
            this._buildHead();
            this._buildBody();
            super.initialize();
        })
    }

    /*
    	@private
    */
    _buildRow() {
        if (this.rowTemplate) {
            return htmlHelper.getElementFromTemplate(this.rowTemplate);

        } else
            return document.createElement("tr")
    }

    /*
    	@protected override
    */
    buildElement(item) {
        if (!this.columns)
            throw new Error("Cannot add item to table : No columns found");

        var element = this._buildRow();
        for (var i = 0; i < this.columns.length; i++) {
            var column = this.columns[i];
            var cell = htmlHelper.getElementFromTemplate(column);
            element.appendChild(cell);
        }
        return element;
    }

    /*
    	@private
    */
    _buildHead() {
        this.head = document.createElement("thead");
        this.appendChild(this.head);

        var row = this.head.appendChild(document.createElement("tr"));
        for (var i = 0; i < this.columns.length; i++) {
            var column = this.columns[i];
            if (this.columnHeadTemplate) {
                var headCell = htmlHelper.getElementFromTemplate(this.columnHeadTemplate);
                row.appendChild(headCell);
                var columnScope = this.scope.createScope();
                columnScope.variables.add("column", column);
                renderer.render(headCell, columnScope)

            } else {
                var headCell = document.createElement("th");
                headCell.innerText = column.title;
                row.appendChild(headCell);
            }


        }

    }

    /*
    	@protected override
    */
    getElementsContainer() {
        return this.body;
    }

    /*
    	@private
    */
    _buildBody() {
        this.body = document.createElement("tbody");
        this.appendChild(this.body);
    }

}


Table
    .define({
        name: "hdr-table"
    });

module.exports = Table;