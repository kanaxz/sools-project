const sools = require("sools");
const Control = require("sools-ui/Control");
const Definition = require("sools-ui/Definition")

require("./contextMenu.scss")
module.exports = sools.define(Control, (base) => {
    class ContextMenu extends base {

        constructor(event, node, datas) {
            super();
            this.datas = datas;
            console.log("datas", datas)
            this.node = node;
            this.event = event;
            this.style.top = event.clientY + "px";;
            this.style.left = event.clientX + "px";
        }
    }

    return ContextMenu;

}, [
    new Definition({
        name: "context-menu",
        template: require("./contextMenu.html")
    })
])