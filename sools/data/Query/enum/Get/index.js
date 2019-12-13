const sools = require("../../../../sools");
const Array  = require("../../../../propertying/Array")
const Properties = require("../../../../propertying/Properties");
const Type = require("../../Type");
const Query = require("../../index");
const meta = require("../../../../meta")
const Env = require("../../../virtualizing/Env")
const Function = require("../../../virtualizing/Reference/enum/Function");
const References = require("../../../virtualizing/Reference/enum")

module.exports = sools.define(Query, (base) => {
    class GetQuery extends base {
    	constructor(modelType,fn){
    		super(modelType);
            if(!fn)
                return
    		var env = new Env();
            var params = meta.getParamsName(fn);
    		this.function = env.function(fn,[new References.array({
                type:modelType,
                id:params[0]
            })])
    	}
    }
    return GetQuery;
}, [
    new Type('get'),
    new Properties({
        function: Function
    })
])