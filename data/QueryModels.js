const sools = require("sools");
const Models = require("./Models");
const modelInterface = require("./modelInterface");
module.exports = sools.define(Models, (base) => {
    class QueryModels extends base{
    	constructor(query, models){
    		super(models);
    		this.query = query;
    		this.modelInterface = this.query.components.get(modelInterface);
    	}
    }

    return QueryModels;
})