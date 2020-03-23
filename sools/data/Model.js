var sools = require("../../sools");
var Propertiable = require("../propertying/Propertiable");
const Data = require("./index")
const VModel = require("./virtualizing/Virtual/enum/Model")

var Model = Data.defineType({
	type:sools.define([Propertiable()],(base)=>{
		return class Model extends base {

			constructor(values){
				super(values);
				this.default();
			}

			attach(datas){
				this.datas = datas;
			}

			load(){
				debugger
			}
		}
	}),
	virtual:VModel
}) 

module.exports = Model;