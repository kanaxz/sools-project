const SourceProcess = require("sools/data/Process");
const ModelInterfaces = require("sools/data/ModelInterfaces");
const Scope = require("sools/processing/Scope");
const models = require("./models");

var datas = new ModelInterfaces(models)

async function work() {
    await datas.setup(new Scope())
    var query = datas.users.get((users) => {
        return users.filter(user =>
            AND(
                user.name.eq("cédric")
            )
        )
    })
    //console.log(query)
    console.log(JSON.stringify(query, null, "\t"))
}

work();