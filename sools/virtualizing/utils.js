const stringUtils = require("../string/utils")
module.exports = {
	gererateVariableId:()=>"var_" + stringUtils.generateUniqueString(10)
}