var types = {
	then: true,
	catch: false
}
class PromiseFactory {

	constructor() {
		this.callStack = [];
	}

	then(fn) {
		this.callStack.push([types.then, fn]);
		return (this);
	}

	catch(fn) {
		this.callStack.push([types.catch, fn]);
		return (this);
	}


	build(value) {
		var promise =Promise.resolve(value);
		this.callStack.forEach(function(call) {
			promise = promise[call[0] ? 'then' : 'catch'](call[1]);
		})
		return (promise);
	}
}

module.exports = PromiseFactory;