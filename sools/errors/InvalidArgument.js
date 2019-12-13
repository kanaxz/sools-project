class InvalidArgumentError extends Error {
	constructor(argumentName) {
		super("Invalid argument supplied" + (argumentName ? ": '" + argumentName + "'" : ""));
	}
}

module.exports = InvalidArgumentError;