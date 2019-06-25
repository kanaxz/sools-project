var Control = require("../Control");

var views = {};
class View extends Control {

	static register(viewName, layoutClass) {
		if (!views[viewName]) {
			this.viewName = viewName;
			this.layoutClass = layoutClass;
			views[viewName] = this;
			return this;
		} else
			throw new Error("View with name '" + viewName + "' is already registered")

	}

	static resolve(viewName) {
		return views[viewName];
	}
}

module.exports = View;