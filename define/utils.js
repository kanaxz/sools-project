var utils = {
    equal: (object1, object2, properties) => {
        for (var property of properties) {
            if (!property.equal(object1[property.name], object2[property.name]))
                return false;
        }
        return true;
    }
}

module.exports = utils;