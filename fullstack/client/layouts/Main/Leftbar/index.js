const sools = require("sools");
const Definition = require("sools-ui/Definition")
const Control = require("sools-ui/Control");
require("./Leftbar.scss")
var UI = require("../UI")

module.exports = sools.define(Control, (base) => {
    class LeftBar extends base {
        constructor() {
            super();
            this.menu = [{
                title: 'Produits',
                view: 'products'
            }, {
                title: 'tags',
                view: 'tags'
            }];
        }
    }
    return LeftBar
}, [
    new Definition({
        constantes: {
            UI
        },
        name: "main-left-bar",
        template: require("./Leftbar.html")
    })
])