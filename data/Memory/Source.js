const Source = require("../Source");
const queryExecutors = require("./queryExecutors");
class MemorySource extends Source {
	constructor(content){
		super();
		this.content = content;
	}

	get(modelType){
		return this.content[modelType.name + "s"];
	}

	executeQueries(queries){
		return Promise.resolve(queries.map((query)=>{
			return queryExecutors.execute(this, query)
		}))
	}
}

module.exports = MemorySource;