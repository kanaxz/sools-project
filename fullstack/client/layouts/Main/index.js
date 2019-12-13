const sools = require("sools");
const Properties = require("sools-define/Properties");
const Definition = require("sools-ui/Definition");

const Layout = require("sools-ui/view/Layout");
require("./Main.scss");
require("./Leftbar");
require("./TopBar");
var UI = require("./UI")

module.exports = sools.define(Layout, (base) => {
    class MainLayout extends base {

        setView(view) {
            this.loading = true;
            return super.setView(view)
                .then(() => {
                    this.loading = false;
                })
        }
    }

    return MainLayout;
}, [
    new Properties('loading'),
    new Definition({
        constantes: {
            UI
        },
        name: "main-layout",
        template: require("./main.html")
    })
])