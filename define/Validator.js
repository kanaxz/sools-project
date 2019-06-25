var sools = require("sools");

var NotImplemented = require("sools/errors/NotImplemented");

module.exports = sools.mixin((base) => {
    
    class Validator extends base {

        validate(validateable){
        	throw new NotImplemented();
        }
    }

    return Validator;
})