var propertyIdentifier = "@";
var stringUtils = require("sools/string/utils");
var delimiters = '*+-=\'"! :[({})];|\n\t'.split('');
var bindHelper = {
    /**
    	@param {string} text
    	@example
    		getPaths("this.user.@name")
    */
    getPaths: function(text) {
        var paths = [];
        var currentText = text;
        var nextObservablePath;
        var stop = false;
        while (!stop) {
            var nextPath = this.getNextObservablePath(currentText);
            if (nextPath) {
                currentText = currentText.replace(nextPath);
                paths.push(nextPath);
            } else
                stop = true;

        }
        return paths;
    },
    getNextObservablePath: function(text) {
        var index = text.indexOf(propertyIdentifier);
        var path = "";
        if (index != -1) {
            var startIndex = stringUtils.getBeginningIndex(text, index, delimiters);
            path += text.substring(startIndex, index);
            startIndex = stringUtils.getEndingIndex(text, index, delimiters)
            path += text.substring(index, startIndex + 1);
            return path;
        }
        return null;
    }
}

module.exports = bindHelper;