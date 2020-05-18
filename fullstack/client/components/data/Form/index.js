const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools/Propertiable/Properties");
const datas = require("datas");
const controls = require("../../../../shared/controls");
const Control = require("sools-ui/Control")
const Display = require("sools-ui/controls/Display")
const Virtuals = require("sools/data/virtualizing/Virtual/enum")
const notify = require("../../notify")
const service = require("../service")
require("./index.scss");



module.exports = sools.define(Control, (base) => {
  class Form extends base {
    constructor(model,values) {
    	super();
    	if(model && values)
    		this.build(model,values)
    }

    async submit(event){
    	var result = this.getDatas(this.model.virtual,this.content);
    	var result = {
    		...this.initialValues,
    		...result
    	}
    	try{
    		await datas.execute(({db})=>{
	    		db.ressources.push([result]);	
	    	})	
	    	this.actions.resolve()
    	}
    	catch(e){
    		notify.display({
    			type:'error',
    			message:e.message
    		})
    		this.actions.reject()
    	}
    	
    	//Location.reload()    	
    }

    getDatas(model,node){
    	var result = {};
    	var fields = node.querySelectorAll(':scope > * > .field')
    	for(var field of fields){
    		var propertyName = field.propertyName;
    		var property = model.properties[field.propertyName];
    		if(property.type.prototype instanceof Virtuals.model){

	    	}
	    	else if(property.type.prototype instanceof Virtuals.object){
	    		result[propertyName] = this.getDatas(property.type,field.querySelector(".content"))
	    	}
	    	else{
	    		var value =  field.querySelector("input").value
	    		if(property.type == Virtuals.number)
	    			value = parseInt(value);
	    		result[propertyName] =value
	    	}
    	}
    	return result;
    }

    getPropertyType(property){
    	return property.type.typeName
    }

    processField(field,property,value){
    	var element;
    	if(property.type.prototype instanceof Virtuals.model){

    	}
    	else if(property.type.prototype instanceof Virtuals.object){
    		element = this.buildObjectFields(property.type,value)
    	}
    	else{
    		element = document.createElement("input");
    		element.type = property.type.typeName;
    		element.value = value || null
    	}
    	field.appendChild(element);
    }

    buildObjectFields(model,values,options){
    	options = options || {}
    	var content = document.createDocumentFragment();
    	for(var propertyName in model.properties){

    		if(propertyName == "_id" || options[propertyName] === false)
    			continue
    		var property = model.properties[propertyName]
    		var display = new Display(this.fieldTemplate,{
    			propertyName,
    			property,
    			value:values[propertyName]
    		});
    		display.attach(this);
    		content.appendChild(display)
    	}
    	return content;
    }

    build(model,values,options){
    	this.model = model;
    	this.content.innerHTML = ""
    	this.initialValues = values;
    	var content = this.buildObjectFields(model.virtual,values,options)

    	this.content.appendChild(content)
    	return new Promise((resolve,reject)=>{
    		this.actions = {
    			resolve,reject
    		}
    	})
    }
  }
  return Form
}, [
  new Properties('loading'),
  new Definition({
    name: "data-form",
    template: require("./index.html")
  })
])