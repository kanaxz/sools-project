const sools = require("sools");
const OperationType = require("./OperationType");
const Typeable = require("sools-define/Typeable");
const Propertiable = require("sools-define/Propertiable");
const NotImplemented = require("sools/errors/NotImplemented");
module.exports = sools.define([Propertiable(), Typeable(OperationType)], (base) => {
    class Operation extends base {
    	processResult(type, result, next){
    		return next(result);
    	}

    	resultToJSON(query, result, next){
    		return next(result);
    	}
    }

    return Operation;
})