var sools = require("sools");

var Properties = require("sools-define/Properties");
var QueryType = require("../QueryType");
var Filterable = require("../mixins/Filterable")
var Limitable = require("../mixins/Limitable")
const Query = require("../Query");
const Models = require("../Models");
module.exports = sools.define(Query,[Filterable(), Limitable()], (base) => {
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
    new QueryType('delete')
])