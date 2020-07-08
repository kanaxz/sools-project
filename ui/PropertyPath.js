class PropertyPath {
	constructor(path) {
		this.path = path;
		this.splittedValue = path.split(".");
	}

	getOrigin(object, variables) {
		if (this.splittedValue[0] == "this")
			return object;
		else
			return variables[this.splittedValue[0]];
	}

	getPath(segmentNumber) {
		return this.split.slice(segmentNumber);
	}
}

module.exports = PropertyPath;