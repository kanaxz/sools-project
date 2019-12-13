const Properties = require("sools/propertying/Properties");
const associations = require("sools/data/Association/enum");
const indexes = require("sools/data/Index/enum");
var models = [
    require("./User"),
    require("./Group"),
    require("./Membership")
]

for (var modelType of models) {
    models[modelType.type.name] = modelType;
}



models.membership.define([
    new Properties({
        group: associations.hasOne({
            type: models.group
        }),
        user: associations.hasOne({
            type: models.user
        })
    }),
    new indexes.unique('group', 'user')
])

models.user.define(
    [new Properties({
        memberships: associations.hasMany(models.membership)
    })]
)

models.group.define(
    [new Properties({
        memberships: associations.hasMany(models.membership)
    })]
)



module.exports = models;