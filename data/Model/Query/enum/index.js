var types = [
    require("./Get"),
    require("./Add"),
    require("./Delete")
]

for (var type of types) {
    types[type.type.name] = type;
}

module.exports = types;