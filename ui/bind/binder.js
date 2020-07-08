var Binding = require("./Binding");

var binder = {
	bindings: [],
	createBinding: function(object, variables, node, propertyPath, content) {
		var binding = new Binding(object, variables, node, propertyPath, content);
		binding.start();
		this.bindings.push(binding);
	},
	destroy: function(node) {
		var bindings = this.bindings;
		for (var i = 0; i < bindings.length; i++) {
			var binding = bindings[i];
			if (binding.dest == node || binding.object == node) {
				binding.destroy();

				bindings.splice(i--, 1);
			}
		}
	}
}

module.exports = binder;