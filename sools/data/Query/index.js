var sools = require("../../sools")
const NotImplemented = require("../../errors/NotImplemented");
const Componentable = require("../../composing/Componentable"); 

var Typeable = require("../../typing/Typeable")
var Properties = require("../../propertying/Properties");
var Propertiable = require("../../propertying/Propertiable");
var ModelType = require("../Model/Type");
var Type = require("./Type");
const Model = require("../Model");
module.exports = sools.define([
	Propertiable(),
    Typeable(Type)
], (base) => {
    class Query extends base {

        constructor(modelType){
            super();
            if(!modelType)
                return
            if(modelType.prototype instanceof Model)
                modelType = modelType.type;
            this.modelType = modelType;
        }

    	setResult(){
    		throw new NotImplemented();
    	}

        static build(values){
            return super.build(values);
        }
    }
    return Query;
},[
	new Properties({
        modelType: ModelType
    })
])