const associations = require("../associations");

var includeExecutors = [{
    type: associations.hasOne,
    execute: (source, query, include, association, results) => {
    	var others = source.content[association.type.type.name + "s"];
        results.forEach((result) => {
        	if(association instanceof associations.hasOne){
        		result[association.name] = others.find((other)=>{
        			return other.id == result[association.name].id;
        		})
        	}
        })
    }
}]

includeExecutors.execute = function(source, query, include, results) {
    var association = query.properties.getByName(include.propertyName)
    var executor = this.find((executor) => {
        return association instanceof executor.type
    });
    if (!executor)
        throw new Error(`association executor not found for type '${association.name}'`)
    return executor.execute(source, query, include, association, results);
}


module.exports = includeExecutors;