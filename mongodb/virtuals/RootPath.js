const Path = require("./Path")
module.exports = class RootPath extends Path {
	constructor(path,rootValue,query){
		super(path);
		this.rootValue = rootValue
		this.query = query;
	}
}
