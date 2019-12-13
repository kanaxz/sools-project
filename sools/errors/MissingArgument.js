class MissingArgument extends Error{
	constructor(argumentName){
		super(`Missing Argument '${argumentName}'`)
	}
}

module.exports = MissingArgument;