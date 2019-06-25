const sools = require("sools");
const View = require("sools-ui/view/View")
const Definition = require("sools-ui/view/Definition");
const MainLayout = require("layouts/Main")
const datas = require("datas");
const notifyService = require("components/notify/service");
const Properties = require("sools-define/Properties");
require("./home.scss");
module.exports = sools.define(View, (base) => {
    class Home extends base {

    }

    return Home;
}, [
	new PRope
    new Definition({
        layout: MainLayout,
        name: "home-view",
        template: require("./home.html")
    })
])