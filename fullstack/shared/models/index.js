const Properties = require("sools-define/Properties");
const associations = require("sools-data/associations");
const Unique = require("sools-data/indexes/Unique");
var models = [
    require("./User"),
    require("./Group"),
    require("./UserGroup")
]


for (var modelType of models) {
    models[modelType.type.name] = modelType;
}

models.userGroup.define([
    new Properties({
        group: associations.hasOne({
            type: models.group
        }),
        user: associations.hasOne({
            type: models.user
        })
    }),
    new Unique('group', 'user'),
])

models.user.define(
    [new Properties({
        groups: associations.hasManyThrough({
            type: models.group,
            through:models.userGroup
        })
    })]
)

models.group.define(
    [new Properties({
        users: associations.hasManyThrough({
            type: models.user,
            through:models.userGroup
        })
    })]
)



module.exports = models;