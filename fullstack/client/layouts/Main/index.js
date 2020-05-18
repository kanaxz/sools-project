const sools = require("sools");
const Properties = require("sools/Propertiable/Properties");
const Definition = require("sools-ui/Definition");

const Layout = require("sools-ui/view/Layout");
require("./Main.scss");
require("./Leftbar");
require("./Topbar");
var UI = require("./UI")

module.exports = sools.define(Layout, (base) => {
    class MainLayout extends base {
      async setView(view) {
        this.loading = true;
        await super.setView(view)
        this.loading = false;
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
    template: require("./Main.html")
  })
])