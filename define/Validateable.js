var sools = require("../sools")
var Validator = reuqire("./Validator");
module.exports = sools.mixin((base, baseType) => {
    
    class Validateable extends base {

    	validate(){
    		for(var validator of this.constructor.validators)
    			validator.validate(this);
    	}

        static define(args) {
            var validators = args.find((arg) => {
                return arg.dependencies.has(Validator);
            })
            this.validators = validators;
            super.define(args);
        }
    }

    return Validateable;
})