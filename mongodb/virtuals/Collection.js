const Virtual = require("sools/executing/Virtual")

module.exports = class Collection extends Virtual {
	constructor(name,source){
		super();
		this.name = name;
		this.source = source;
		this.mongo = this.source.db.collection(this.name)
	}

	async insertMany(models){		
		var result = await this.mongo.insertMany(models)
		return models;
	}

	aggregate(pipeline){
		return this.mongo.aggregate(pipeline)
	}
}