var LinkParamsBinding = require("./LinkParamsBinding");
class Link {
	constructor(worker, object, node, variables, options) {
		this.worker = worker;
		this.object = object;
		this.node = node;
		this.variables = variables;
		this.viewName = options.viewName;
		this.active = options.active;
		if (this.viewName) {
			this.fn = function(e) {
				e.preventDefault();
				this.worker.redirect(this.viewName, this.getParams());
			}.bind(this);
			this.node.addEventListener("click", this.fn);

			if (options.params) {
				this.paramsBinding = new LinkParamsBinding(this, object, variables, options.params);
				this.paramsBinding.start();
				this.paramsChanged();
			}
		}
	}

	getParams() {
		return this.paramsBinding ? this.paramsBinding.getResult() : null;
	}

	paramsChanged() {
		this.worker.linkChanged(this);
	}

	destroy() {
		this.node.addEventListener("click", this.fn);
		this.object = null;
		this.variables = null;
		this.node = null;
		this.fn = null;
		if (this.paramsBinding) {
			this.paramsBinding.destroy();
			this.paramsBinding = null;
		}

	}
}

module.exports = Link;