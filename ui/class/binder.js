var ClassBinding = require("./ClassBinding");
var binder = {
	bindings: [],
	createBinding: function(object, variables, node, className, content) {
		var binding = new ClassBinding(object, variables, node, className, content);
		binding.start();
		this.bindings.push(binding);
	},
	destroy: function(node) {
		var bindings = this.bindings;
		for (var i = 0; i < bindings.length; i++) {
			var binding = bindings[i];
			if (binding.node == node) {
				binding.destroy();

				bindings.splice(i--, 1);
			}
		}
	}
}

module.exports = binder;