var stringChars = "\"'";
/**
    @namespace whitecrow.stringHelper
*/
var stringUtilities = {
    normalizeVariableName: function(variableName) {
        if (variableName[0] == variableName[0].toUpperCase())
            variableName = this.replaceAt(variableName, 0, variableName[0].toLowerCase())
        return (variableName);
    },
    capitalize: function(string) {
        return this.replaceAt(string, 0, string[0].toUpperCase());
    },
    minuscule: function(string) {
        return this.replaceAt(string, 0, string[0].toLowerCase());
    },

    replaceAt: function(string, index, replacement) {
        return string.substr(0, index) + replacement + string.substr(index + replacement.length);
    },
    generateUniqueString(length) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }

        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    },
    fromTo(string, from, to) {
        var result = "";
        for (var i = from; i < to; i++)
            result += string[i];
        return result;
    },
    splitAt(string, index) {
        return [
            this.fromTo(string, 0, index),
            this.fromTo(string, index + 1, string.length)
        ]
    },
    splitAtFirst(string, char) {
        var index = string.indexOf(char);
        return this.splitAt(string, index);
    },
    plural: (string) => {
        return string + "s";
    },
    replaceAt: function(string, index, replacement) {
        return string.substr(0, index) + replacement + string.substr(index + replacement.length);
    },
    minuscule: function(string) {
        return this.replaceAt(string, 0, string[0].toLowerCase());
    },
    /**
        @typedef whitecrow.stringHelper.advancedSplitOptionsWork
        @type {function}
        @param {string} segment
        @return {object} result - You can return whatever you want in this callback
    */

    /**
        @typedef whitecrow.stringHelper.advancedSplitOptions
        @property {bool=} includeOutside
        @property {string} startDelimiter
        @property {string} endDelimiter
        @property {whitecrow.stringHelper.advancedSplitOptionsWork=} work - Will be called every time a segment is found
    */

    /**     

        @public
        @static
        @memberof whitecrow.stringHelper
        @param {string} content
        @param {whitecrow.stringHelper.advancedSplitOptions} options
        @return {Array<string|object>}
        @example
     *var result = whitecrow.stringHelper.advancedSPlit("My name is {{user.name}} and I'm {{user.age}} years old",{
     *  startDelimiter:"{{",
     *  endDelimiter:"}}"
     *}) 
     * // result = ["user.name","user.age"];
    */
    advancedSplit: function(content, options) {
        var resultArray = [];
        var isIn = false;
        var matchCount = 0;
        var segment = "";

        for (var i = 0; i < content.length; i++) {
            var c = content[i];
            if (!isIn) {
                segment += c;
                if (c == options.startDelimiter[matchCount]) {
                    matchCount++
                } else
                    matchCount = 0;
                if (matchCount == options.startDelimiter.length) {
                    if (options.includeOutside) {
                        var string = segment.slice(0, -options.startDelimiter.length);
                        if (string.length != 0) {
                            resultArray.push(string);
                        }
                    }


                    isIn = true;
                    matchCount = 0;
                    segment = "";
                } else if (i == content.length - 1)
                    if (options.includeOutside)
                        resultArray.push(segment);

            } else {
                segment += c;
                if (c == options.endDelimiter[matchCount]) {
                    matchCount++;
                } else
                    matchCount = 0;
                if (matchCount == options.endDelimiter.length) {

                    var segmentContent = segment.slice(0, -options.endDelimiter.length);
                    isIn = false;
                    segment = "";
                    matchCount = 0;

                    if (options.work)
                        resultArray.push(options.work(segmentContent));
                    else
                        resultArray.push(segmentContent);

                } else if (i == content.length - 1)
                    if (options.includeOutside)
                        resultArray.push(segment);
            }
        }
        return resultArray;
    },
    /**
        source : '{data:{item:this.@value}}'
    */
    processKeyValue: function(source, work) {
        var key = "";
        var value;
        var inString = false;
        var inRegex = false;
        var inValue = false;
        var escapeChar = false;
        var scopeCount = 0;
        var stringChar;
        for (var i = 1; i < source.length - 1; i++) {
            var c = source[i];
            if (inValue) {
                if (inRegex) {
                    if (c == "/")
                        inRegex = false;
                } else if (inString) {
                    if (escapeChar) {
                        escapeChar = false;
                    } else if (c == '\\') {
                        escapeChar = true;
                    } else if (c == stringChar) {
                        inString = false;
                        stringChar = null;
                    }
                } else {
                    if (c == '{') {
                        scopeCount++;
                    } else if (c == '}') {
                        scopeCount--;
                    } else {
                        var index = stringChars.indexOf(c);
                        if (index != -1) {
                            inString = true;
                            stringChar = stringChars[index];
                        } else if (c == "/") {
                            inRegex = true;
                        }
                    }
                }
                if ((c == ',' || i == source.length - 2) && !inRegex && !inString && !scopeCount) {
                    if (c != ',' && i == source.length - 2) {
                        value += c;
                    }
                    work(key, value);
                    inValue = false;
                    key = "";
                } else {
                    value += c;
                }

            } else {
                if (c == ":") {
                    value = "";
                    inValue = true;
                } else {
                    key += c;
                }
            }

        }
    },
    /**
        @public
        @static
        @memberof whitecrow.stringHelper
        @description Replace the replaceString at the beginning of the source if it exists, or return null
        @param {string} source
        @param {string} replaceString
        @return {string|null}
    */
    replaceStartOrNull: function(source, replaceString) {
        var result = "";

        for (var i = 0; i < source.length; i++) {
            var c = source[i];

            if (i < replaceString.length) {
                if (c == replaceString[i]) {
                    continue
                } else
                    return null;
            } else {
                result += c;
            }

        }
        if (result == "")
            return null;
        return result;
    },

    getEndingIndex: function(source, index, delimiters) {
        return this.getLimitIndex(source, index, delimiters, 1);
    },
    getBeginningIndex: function(source, index, delimiters) {
        return this.getLimitIndex(source, index, delimiters, -1);
    },
    getLimitIndex: function(source, index, delimiters, sense) {
        for (var i = index; true; i = i + sense) {
            var c = source[i];
            if (delimiters.indexOf(c) != -1) {
                return i - sense;
            }
            // limits
            else if (i == 0 || i == source.length - 1) {
                return i;
            }
        }
    },
    replaceAll: function(source, pattern, replacement) {
        return source.replace(new RegExp(pattern, 'g'), replacement || '');
    },



}

module.exports = stringUtilities;