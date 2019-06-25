const Process = require("sools-process/Process");
const Interface = require("./Interface");
const Query = require("sools-data/Query");
const ModelInterfaces = require("sools-data/ModelInterfaces");
class MongoProcess extends Process {
    constructor(url, dbName) {
        super();
        this.interface = new Interface(url, dbName);
    }

    setup(context, next) {
        return this.interface.start().then(() => {
            this.modelInterfaces = context.components.get(ModelInterfaces);
            return super.setup(context, next);
        })
    }

    execute(context, next) {
        var queries = context.components.getAll(Query);
        return Promise.all(queries.map((query) => {
                return this.interface.query(query)
                    .then((result)=>{
                        query.setResult(this.modelInterfaces,result);
                    })
            }))
            .then(() => {
                return super.execute(context, next);
            })

    }

    stop(context, next) {
        return this.interface.stop()
        .then(()=>{
            return super.stop(context, next);
        })
    }
}

module.exports = MongoProcess;