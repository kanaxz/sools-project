const Query = require("./Query")
const Virtual = require("sools/executing/Virtual");
const Collection = require("./Collection")

module.exports = class Datas extends Virtual {
	constructor(source,datas){
		super();
		this.source = source;
		this.datas = datas
	}

	getProperty(collectionName){		
		return new Collection(collectionName,this.source)
	}
}