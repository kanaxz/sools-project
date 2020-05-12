const Virtual = require("sools/executing/Virtual")
const MongoScope = require("../Scope")

module.exports = class Cursor extends Virtual {
	constructor(collection,mongo){
		super();		
		this.collection = collection;
		this.mongo = mongo;
	}

	async getValue(scope){
		return await this.mongo.toArray()
	}
}