require("./404.scss");
var View = require("hedera/viewing/View")
var MainLayout = require("layouts/Main")

class Error404View extends View {


}

module.exports = Error404View
	.define({
		layout:MainLayout,
		name: "error404-view",
		template: require("./404.html")
	});

