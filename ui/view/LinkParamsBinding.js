var BaseBinding = require("../bind/BaseBinding");
class LinkParamsBinding extends BaseBinding {
	constructor(link, object, variables, content) {
		super(object, variables, content);
		this.link = link;
	}

	changed() {
		this.link.paramsChanged();
	}
}

module.exports = LinkParamsBinding;