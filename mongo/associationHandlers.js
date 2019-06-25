const associations = require("sools-data/associations");
const includeHelper = require("./includeHelper");

var associationHandlers = [{
    type: associations.hasManyThrough,
    handle: (interface, modelType, include, property, pipeline) => {
        var throughCollection = interface.getModelCollectionDefinition(property.through.type);
        var otherCollection = interface.getModelCollectionDefinition(property.type);
        var lookup = includeHelper.hasMany.process({
            from: throughCollection.name,
            as: property.name,
            foreignKey: property.through.this
        }, pipeline);


        for (var operation of include.operations) {
            associationHandlers.operationHandlers.handle(interface, property.type, operation, lookup.pipeline);
        }
    }
}, {
    type: associations.hasOne,
    handle: (interface, modelType, include, property, pipeline) => {
        const otherCollection = interface.getModelCollectionDefinition(property.type);

        includeHelper.hasOne.process({
            as: property.name,
            from: otherCollection.name,
            foreignProperty: property.name
        }, pipeline);
        /*
        for (var operation of include.operations) {
            operationHandlers.handle(interface, property.type, operation, subPipeline);
        }
        /**/
    }
}]

associationHandlers.handle = function(interface, modelType, include, pipeline) {
    var property = modelType.properties.getByName(include.propertyName);
    var handler = this.find((handler) => {
        return property instanceof handler.type
    });
    if (!handler)
        throw new Error(`Handler not found for association '${property.name}'`)
    handler.handle(interface, modelType, include, property, pipeline);
}

module.exports = associationHandlers;