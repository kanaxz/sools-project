const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools/Propertiable/Properties");
const Control = require("sools-ui/Control")
const moment = require("moment-timezone");
const utils = require("../utils")
const constantes = require("../../../../../../shared/constantes")
require("./index.scss");

module.exports = sools.define(Control, (base) => {
  return class Form extends base {
  	constructor(){
  		super();
  		this.editRessource = false;
  		this.ressourceTypes = constantes.ressourceTypes;
  	}

  	build(){
  		return utils.build(this.ressource)
  	}

  	submit(){
  		console.log('submit')
  		this.resolve({
  			...utils.parse(this.input.value),
  			type:this.type.value,
  			position:{
  				x:parseInt(this.x.value),
  				y:parseInt(this.y.value),
  			}
  		})
  	}

  	edit(ressource){
  		this.ressource = ressource;
  		setTimeout(()=>{
  			if(this.ressource.type)
  				this.input.focus()
  			else
  				this.type.focus();	
  		},150)
  		return new Promise((resolve,reject)=>{
  			this.resolve = resolve;
  			this.reject = reject;
  		})
  	}


  }
}, [
  new Properties('ressource','editRessource'),
  new Definition({
    name: "ressource-form",
    template: require("./index.html")
  })
])