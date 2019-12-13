var types = [
    require("./Get")
]

for (var type of types) {
    types[type.type.name] = type;
}

module.exports = types;