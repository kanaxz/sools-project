var pathHelper = {
	set: function(object, pathString, value) {
		var splitted = pathString.split(".");
		var current = object;
		for (var i = 0; i < splitted.length - 1; i++) {
			current = current[splitted[i]];
		}


		current[splitted[splitted.length - 1]] = value;
		return value;
	},

	get: function(object, pathString) {
		var splitted = pathString.split(".");
		var current = object;
		for (var i = 0; i < splitted.length; i++) {
			if (current == null)
				return null;
			current = current[splitted[i]];
		}
		return current;
	}
}

module.exports = pathHelper;