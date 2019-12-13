const Process = require("../processing/Process");
const ModelInterfaces = require("./ModelInterfaces");
const Array=  require("../propertying/Array");
const Query = require("./Query");
const Queries = Array.of(Query)
const NotImplemented = require("../errors/NotImplemented");
const BuildOption = require("./BuildOption");
class Source extends Process {

	constructor(modelTypes){
		super();
		this.modelTypes = modelTypes;
	}

    async setup(scope, next) {
        this.modelInterfaces = scope.get(ModelInterfaces);
        return await super.setup(scope, next);
    }

    executeQueries(queries){
    	throw new NotImplemented();
    }

    async execute(scope, next){
    	var queries = scope.get(Queries);
        var buildOptions = scope.filter((c)=>{
            return c.dependencies && c.dependencies.has(BuildOption);
        });
        buildOptions.push(this.modelInterfaces)
    	var results = await this.executeQueries(queries);
		queries.forEach((query, index)=>{
			query.setResult(this.modelInterfaces, results[index],buildOptions);
		})
    	return await super.execute(scope, next);
	}
}

module.exports = Source;