var Navigator = require("./components/navigation/Navigator");
var AUTH_VIEW = "auth";
var HOME_VIEW = "home";
var datas = require("./datas");
//var authService = require("./components/user/authService")
var notifyService = require("./components/notify/service")
class HederaNavigator extends Navigator {

	constructor() {
		super();
	}

	start(presenter) {
		this.presenter = presenter;
		return super.start();
	}

	linkChanged(event) {
		var link = event.detail.link;
		var route = this.getRouteByName(link.name);
		var node = link.node;
		if (route && node.tagName == "A") {
			var url = this.stringify(route, link.getParams());
			node.href = url;
		}
	}

	redirecting(event) {

		event.preventDefault();
		var routeName = event.detail.viewName;
		var params = event.detail.params;
		var route = this.getRouteByName(routeName);
		if (!route)
			this.notFound({
				replaceState: false
			});
		else
			this.navigate(route, params);
	}

	validateRoute(route) {
		return true;
		return authService.me || route.page.options.name == AUTH_VIEW;
	}

	routeTriggered(route, viewDatas) {
		if (this.validateRoute(route)) {
			var page = route.page;
			return Promise.resolve(page.options.view())
				.then((View) => {
					View.register(route.page.options.name);
					return this.presenter.display(new View(viewDatas), View.layout);
				})
		} else {
			return this.navigate(AUTH_VIEW, {
				url: encodeURIComponent(window.location.pathname)
			});
		}
	}

	default (obj) {
		this.home().then(() => {
			if (obj instanceof Error)
				notifyService.display({
					message: obj.message,
					type: 'error'
				})
			else
				notifyService.display({
					message: obj
				})
		})
	}

	home() {
		return this.navigate(HOME_VIEW, null, {replaceState:true});
	}
}

module.exports = new HederaNavigator();