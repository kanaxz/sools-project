const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools-define/Properties");
const InterfacePanel = require("../Interface");
var Panel = require("sools-ui/controls/panel/Panel")
require("./index.scss");



module.exports = sools.define(Panel, (base) => {
    class InterfacesPanel extends base {
        constructor(interfaces) {
            super("datas");
            this.interfaces = interfaces;
        }

        showInterface(modelInterface) {
            this.show(new InterfacePanel(modelInterface));
        }
    }
    return InterfacesPanel
}, [
    new Properties(),
    new Definition({
        name: "explorer-interfaces",
        template: require("./index.html")
    })
])