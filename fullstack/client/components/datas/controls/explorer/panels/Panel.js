const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools-define/Properties");
var Panel = require("sools-ui/controls/panel/Panel")

module.exports = sools.define(Panel, (base) => {
    class Interface extends base {
        constructor(title, actions) {
            super(title);
            this.actions = actions || [];;
        }
    }
    return Interface
})