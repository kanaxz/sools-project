const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools/Propertiable/Properties");
const Control = require("sools-ui/Control")
const moment = require("moment-timezone");
const utils = require("../utils")
require("./index.scss");

module.exports = sools.define(Control, (base) => {
  return class Ressource extends base {
  	constructor(ressource){
  		super();
  		console.log(ressource)
  		this.ressource = ressource;
  		this.update()
  	}

  	update(){
  		this.value = utils.build(this.ressource);
  	}
  }
}, [
  new Properties('ressource'),
  new Definition({
    name: "app-ressource",
    template: require("./index.html")
  })
])