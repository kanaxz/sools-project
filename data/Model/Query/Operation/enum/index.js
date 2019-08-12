var list = [
    require("./list/Includeable/Include"),
    require("./list/Filterable/Filter"),
    require("./list/Limitable/Limit"),
]

for (var type of list) {
    list[type.type.name] = type;
}

module.exports = list;