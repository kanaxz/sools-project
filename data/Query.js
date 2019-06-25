var sools = require("sools")
const NotImplemented = require("sools/errors/NotImplemented");
const Componentable = require("sools-define/Componentable"); 

var Typeable = require("sools-define/Typeable")
var Properties = require("sools-define/Properties");
var Propertiable = require("sools-define/Propertiable");
var ModelType = require("./ModelType");
var QueryType = require("./QueryType");
const Model = require("./Model");
module.exports = sools.define([
	Propertiable(),
    Typeable(QueryType),
    Componentable()
], (base) => {
    class Query extends base {

        constructor(modelType){
            super();
            if(modelType.prototype instanceof Model)
                modelType = modelType.type;
            this.modelType = modelType;
        }

    	setResult(){
    		throw new NotImplemented();
    	}
    }
    return Query;
},[
	new Properties({
        modelType: Properties.types.object({
            type: ModelType
        })
    })
])