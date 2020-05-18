const stringUtils = require("../string/utils")

var utils = {
	gererateVariableId(){
		return "var_" + stringUtils.generateUniqueString(10)
	}
}

module.exports = utils;