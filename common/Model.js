const Model = require("sools-data/Model");
const sools = require("sools");
const Properties = require("sools-define/Properties");
const Primary = require("sools-data/indexes/Primary");
const Storable = require("sools-data/storing/Storable");

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