var operations = [
    require("./mixins/Includeable/Include"),
    require("./mixins/Filterable/Filter"),
    require("./mixins/Limitable/Limit"),
    require("./mixins/Targetable/Target")
]

var result = {
    content: operations
}

for (var operator of operations) {
    result[operator.type.name] = operator
}

module.exports = result