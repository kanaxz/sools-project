const sools = require("sools");
var Control = require("../../Control")
const Properties = require("sools-define/Properties");
var first = true;
module.exports = sools.define(Control, (base) => {
    class Panel extends base {

        constructor(title) {
            super();
            this.title = title;
        }

        attach(scope) {
            this.panels = scope.source;
            return super.attach(scope);
        }

        show(panel) {
            this.panels.show(this, panel)
        }

        close() {
            this.panels.close(this);
        }
    }
    return Panel
})