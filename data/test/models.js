const Properties = require("sools-define/Properties");
const associations = require("../associations");
const Unique = require("../indexes/Unique");
var models = [
    require("./User"),
    require("./Group"),
    require("./Membership")
]


for (var modelType of models) {
    models[modelType.type.name] = modelType;
}

models.memberships.define([
    new Properties({
        group: associations.hasOne({
            type: models.group
        }),
        user: associations.hasOne({
            type: models.user
        })
    }),
    new Unique('group', 'user')
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