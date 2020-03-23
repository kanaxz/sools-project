const VModel = require("./virtualizing/Virtual/enum/Model");
const Propertiable = require("../propertying/Propertiable");
const Properties = require("../propertying/Properties")
const Base = require("../core/Base");
const sools = require("../index")
const Virtualizing = require("../virtualizing")
const associations = require("./Association/enum");
var propertyTypes = require("../propertying/Property/types");
var virtualTypes = require("./virtualizing/Virtual/enum")

var virtualPropertyMapping =  [
    ['number',()=>({type:virtualTypes.number})],
    ['string',()=>({type:virtualTypes.string})],
    ['hasMany',(property)=>({
        type:virtualTypes.hasMany,
        model:property.model.virtual,
        load:property.load
    })]
]

var propertyMapping = [
  ['number',()=>(propertyTypes.number())],
  ['string',()=>(propertyTypes.string())],
  ['hasMany',(property)=>(propertyTypes.hasMany({
    type:property.model.type,
    load:property.load
  }))]

]

class TypeDescription {
	constructor(values){
    for(var p in values)
        this[p] = values[p];
	}

	registerProperties(properties){
		var typeProperties = {};
		var virtualProperties = {};
		for(var propertyName in properties){
			var property = properties[propertyName];
      var kv = virtualPropertyMapping.find((kv)=>kv[0] == property.type);
      if(property instanceof TypeDescription){
        property = {
          type:property
        }
      }
      if(kv){
        virtualProperties[propertyName] = kv[1](property);  
      }
      else{
        virtualProperties[propertyName] = {
          type:property.type.virtual,
          load:property.load
        }
      }
      var tkv = propertyMapping.find((tkv)=>tkv[0] == property.type)
      if(tkv){
        typeProperties[propertyName] = tkv[1](property)
      }
      else if(this.virtual.prototype instanceof VModel){
       typeProperties[propertyName] = associations.hasOne({

       })
      }
      else{
        typeProperties[propertyName] = propertyTypes.object({
          type:property.type.type
        })
      }
		}
		this.type.define([new Properties(typeProperties)]);
    this.virtual.registerProperties(virtualProperties);
	}
}

var Data = {
	defineType:(typeDescription)=>{
    if(!typeDescription.virtual){
	 	typeDescription.virtual = Virtualizing.defineType({
	 		name:typeDescription.name,
            extends:typeDescription.extends && typeDescription.extends.virtual
        })
    }
    if(!typeDescription.type)
	   typeDescription.type = sools.define(typeDescription.extends && typeDescription.extends.type || Base)
		var instance = new TypeDescription(typeDescription);
		if(typeDescription.properties)
			instance.registerProperties(typeDescription.properties);
		return instance
	},
	define:(models)=>{
    var result = {};
    for(let modelName in models){
    	var modelDescription = models[modelName]
      result[modelName] = Data.defineType({
      	name:modelName,
      	pluralName:modelName + "s",
      	extends:modelDescription.extends
      })
    }

    for(let modelName in models){
        var model = models[modelName];
        var vproperties = {};
        var properties = {}
        for(var propertyName in model.properties){
            var property =  model.properties[propertyName];
            if(typeof(property) == "string"){
                property = {
                    type:property
                }
            }
            else if(property instanceof Array){
              property = {
                type:'hasMany',
                model:result[property[0]],
                load:(model,hasMany)=>{
                  return hasMany.filter((subModel)=>{
                    return subModel[modelName].eq(model)
                  })
                }
              }
            }
            if(result[property.type]){
            	property.type = result[property.type];
              if(property.has === false){
                property.load = (m,models)=>{
                  return models.filter((subModel)=>{
                    return m.eq(subModel[model.name])
                  })
                }
              }
              else if(!property.load){
                property.load = (m,models)=>{
                  return models.filter((subModel)=>{
                    return m[property.type.name].eq(subModel)
                  })
                }
              }
            }
            model.properties[propertyName] = property;
        }
        result[modelName].registerProperties(model.properties);
       
    }  
  	return result;
	}
}

module.exports =  Data;