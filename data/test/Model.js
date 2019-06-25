const Model = require("../Model");
const sools = require("sools");
const Properties = require("sools-define/Properties");
const Primary = require("../indexes/Primary");
const Storable = require("../storing/Storable");
module.exports = sools.define(Model,[Storable()],(base)=>{
	class TestModel extends base {

	}

	return TestModel
},[
	new Properties({
		id:Properties.types.number()
	}),
	new Primary('id')
])