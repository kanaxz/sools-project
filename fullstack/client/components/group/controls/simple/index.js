var Control = require("sools-ui/Control");

const sools = require("sools");
const Properties = require("sools-define/Properties");
const Definition = require("sools-ui/Definition");

require("./index.scss")
module.exports = sools.define(Control, (base) => {

    class SimpleGroup extends base {
        constructor(group) {
            super();
            this.group = group;
        }
    }

    return SimpleGroup;

}, [
    new Properties('group'),
    new Definition({
        name: "group-simple",
        template: require("./index.html")
    })
])