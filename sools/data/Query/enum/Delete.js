var sools = require("../../../sools");

var Properties = require("../../../propertying/Properties");
var Type = require("../Type");
const OperationsEnum = require("../Operation/enum");
const Query = require("../");
module.exports = sools.define(Query,[OperationsEnum.filter.behavior(), OperationsEnum.limit.behavior()], (base) => {
    class Delete extends base {
    	setResult(modelInterfaces, deleteCount){
    		this.result = deleteCount;
    	}

    	resultToJSON(){
    		return this.result;
    	}
    }
    return Delete;
}, [
    new Type('delete')
])