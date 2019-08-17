var Enum = [
    require("./Include"),
    require("./Filter"),
    require("./Limit"),
]

for (var type of Enum) {
    Enum[type.type.name] = type;
}

module.exports = Enum;