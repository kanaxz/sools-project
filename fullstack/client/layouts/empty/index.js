const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Layout = require("sools-ui/view/Layout");
require("./empty.scss");
module.exports = sools.define(Layout, (base) => {

    class EmptyLayout extends base {


    }
    return EmptyLayout;
}, [
    new Definition({
        name: "empty-layout",
        template: require("./empty.html")
    })
])