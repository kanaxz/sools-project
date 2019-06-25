const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools-define/Properties");
var Control = require("sools-ui/Control")

require("./index.scss");

module.exports = sools.define(Control, (base) => {
    class Loader extends base {
     }
    return Loader
},[
	new Properties('loading'),
	new Definition({
        transclude: true,
        name: "app-loader",
        template: require("./index.html")
    })
])
