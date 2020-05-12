const NotImplemented = require("../errors/NotImplemented.js")

module.exports =  class Executable {
	constructor(){

	}
	execute(){
		throw new NotImplemented()
	}
}