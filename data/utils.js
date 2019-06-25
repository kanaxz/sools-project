var conditions = require("./conditions");

var utils = {
    isAndOr(condition) {
        return (condition instanceof conditions.and) || (condition instanceof conditions.or)
    },
    reverse:(query, results)=>{
    	
    }
}

module.exports = utils;