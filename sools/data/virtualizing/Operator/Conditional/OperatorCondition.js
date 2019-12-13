var sools = require("sools");
var Condition = require("../Condition")
const Var = require("../Var");
const Operator = require("../Operator");
module.exports = sools.define(Condition,[
	new Properties({
		operator:Operator,
		var:Var
	})
])