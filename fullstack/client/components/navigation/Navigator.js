var Page = require("./Page");
class Navigator {
	constructor() {
		this.pages = [];
		this.firstLoad = true;
	}

	page(options) {
		var page = new Page(options);
		this.pages.push(page);
		return (page);
	}

	start() {
		window.onpopstate = this.onpopstate.bind(this);
		return this.processCurrent();
	}

	onpopstate(event) {
		this.processCurrent();
	}

	parseUrl(url) {
		var splittedUrl = url.split("/").filter((s) => {
			return s
		});

		for (var page of this.pages) {
			for (var route of page.routes) {
				var routeMatch = true;
				var models;
				if (route.hasModel) {
					models = {};
					for (var modelName in route.models) {
						models[modelName] = new route.models[modelName]();
					}
					console.log("MODELS", models)
				}
				for (var y = 0; y < splittedUrl.length; y++) {
					var routeSegment = route.segments[y];
					var urlSegment = splittedUrl[y];
					if (!routeSegment) {
						routeMatch = false;
						break;
					}

					if (typeof routeSegment == "string") {
						if (routeSegment != urlSegment) {
							routeMatch = false;
							break;
						}
					} else {
						try {
							routeSegment.parse(models, urlSegment);
						} catch (e) {
							console.log("error", e)
							routeMatch = false;
							break;
						}
					}
				}
				if (routeMatch)
					return {
						route: route,
						models: models
					}
			}
		}
	}

	navigateUrl(url) {
		return this.process(url, true);
	}

	process(url, updateUrl) {

		var result = this.parseUrl(url);
		if (!result)
			throw new Error("Route not found");
		if (updateUrl)
			this.updateUrl(result.route, result.models);
		return this.setRoute(result.route, result.models);
	}

	processCurrent() {
		return this.process(window.location.pathname)
	}

	navigate(arg1, models, options) {
		var route;
		if (typeof arg1 == "string") {
			route = this.getRouteByName(arg1);
			if (route == null)
				throw new Error(`Route named '${arg1}' not found`);
		} else
			route = arg1;
		options = options || {
			replaceState: false
		};
		var page = route.page;
		this.updateUrl(route, models, options.replaceState);
		return (this.setRoute(route, models));
	}

	stringify(route, viewData) {
		var models;
		if (viewData)
			models = viewData.constructor.isModel ? {
				model: viewData
			} : viewData;
		var result = "";
		for (var segment of route.segments) {
			result += "/";
			if (typeof(segment) == "string")
				result += segment;
			else {
				result += segment.stringify(models);
			}
		}
		return (result);
	}

	updateUrl(route, viewData, replaceState) {
		history[replaceState ? "replaceState" : "pushState"](null, null, this.stringify(route, viewData));
		document.title = route.options.title;
	}

	setRoute(route, models) {
		var page = route.page;
		var param = route.getParam(models);
		return route.build(param)
			.then((viewData) => {
				if (route != page.defaultRoute)
					this.updateUrl(page.defaultRoute, viewData, true);
				return this.routeTriggered(route, viewData);
			})
			.catch(err => {
				throw err;
			})
	}

	routeTriggered(route, viewDatas) {
		throw new Error("");
	}

	notFound(options) {
		return this.navigate("404", null, options)
	}

	getRouteByName(routeName) {
		for (var page of this.pages) {
			var route = page.getRouteByName(routeName);
			if (route)
				return route;
		}
		return null;
	}
}

module.exports = Navigator;