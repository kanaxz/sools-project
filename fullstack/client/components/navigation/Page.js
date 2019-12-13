var Route = require("./Route");
class Page {
	constructor(options) {
		this.routes = [];
		this.options = options;
		this.defaultRoute = null;
	}

	route(routeOptions) {
		var rt = new Route(this, routeOptions || this.options);
		this.routes.push(rt);
		if (!routeOptions)
			this.defaultRoute = rt;
		return (rt);
	}

	getRouteByName(routeName) {
		return this.routes.find((route) => {
			return route.options.name == routeName
		});
	}
}

module.exports = Page;