var utils = {
    /**
        @public
        @static
        @method attributeToJs
        @memberof whitecrow.stringHelper
        @param {object} controlClass - A class which inherits from {@link whitecrow.control control}
        @return {string} Formatted js name
        @description The idea here is to upperCase every char preceded by '-'
        @example
        inner-text => innerText
    */
    attributeToJs: function(attributeName) {
        var result = "";
        for (var i = 0; i < attributeName.length; i++) {
            var c = attributeName[i];
            if (c == "-" && i != attributeName.length - 1) {
                // get the next char and upperCase it
                result += attributeName[++i].toUpperCase();
            } else
                result += c;
        }
        return result;
    },
    /**
        @public
        @static
        @method jsToAttribute
        @memberof whitecrow.stringHelper
        @param {string} source
        @return {string} Formatted attribute name
    */
    jsToAttribute: function(source) {
        var name = "";
        for (var i = 0; i < source.length; i++) {
            var char = source[i];
            if (!isNaN(char * 1)) {
                name += char;
            } else {

                if (char == char.toUpperCase()) {

                    name += "-" + char.toLowerCase();
                } else if (char == char.toLowerCase()) {
                    name += char;
                }

            }

        }
        return name;
    }
}

module.exports = utils;