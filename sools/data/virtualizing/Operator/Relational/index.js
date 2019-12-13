const Operator = require("../index")
const Var = require("../../Var")
const sools = require("../../../../sools")
const Properties = require("../../../../propertying/Properties")

module.exports = sools.define(Operator,[
	new Properties({
		var:Var
	})
])