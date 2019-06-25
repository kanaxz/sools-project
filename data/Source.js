const Process = require("sools-process/Process");
const ModelInterfaces = require("./ModelInterfaces");
const Query = require("./Query");
const NotImplemented = require("sools/errors/NotImplemented");
const BuildOption = require("./BuildOption");
class Source extends Process {

	constructor(modelTypes){
		super();
		this.modelTypes = modelTypes;
	}

    setup(context, next) {
        this.modelInterfaces = context.get(ModelInterfaces);
        return super.setup(context, next);
    }

    executeQueries(queries){
    	throw new NotImplemented();
    }

    execute(context, next){
    	var queries = context.getAll(Query);
        var buildOptions = context.filter((c)=>{
            return c.dependencies && c.dependencies.has(BuildOption);
        });
        buildOptions.push(this.modelInterfaces)
    	return this.executeQueries(queries).then((results)=>{
    		queries.forEach((query, index)=>{
    			query.setResult(this.modelInterfaces, results[index],buildOptions);
    		})
    		return super.execute(context, next);
    	})
	}
}

module.exports = Source;