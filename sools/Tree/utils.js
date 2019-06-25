var treeUtils = {
    forEach: (array, fn, containerType) => {
        array.forEach((object) => {
            if (object instanceof containerType) {
                treeUtils.forEach(object, fn, containerType);
            } else
                fn(object);
        })
    },
    find: (array, fn, containerType) => {
        for (var object of array) {
            if (object instanceof containerType) {
                var result = treeUtils.find(object, fn, containerType);
                if(result)
                	return result;
            } else {
            	if(fn(object))
            		return (object);
            }
        }
        return null;
    }
}

module.exports = treeUtils;