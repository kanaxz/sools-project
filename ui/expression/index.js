var ExpressionBinding = require("./ExpressionBinding");
var pathHelper = require("../pathHelper");
var stringHelper = require("../stringHelper");
var startBindFunctionDelimiter = "{{";
var endBindFunctionDelimiter = "}}";
class Expression {
    constructor(object, variables, node, nodePropertyPath, content) {
        this.object = object;
        this.variables = variables;
        this.node = node;
        this.nodePropertyPath = nodePropertyPath;
        this.contentArray = null;
        this.processContent(content);
    }


    start() {
        for (var i = 0; i < this.contentArray.length; i++) {
            var contentObject = this.contentArray[i];
            if (contentObject instanceof ExpressionBinding)
                contentObject.start();
        }
        this.changed();

    }


    // called from expressionBindFunctions
    changed() {
        pathHelper.set(this.node, this.nodePropertyPath, this.getResult());
    }

    getResult() {
        var result = "";
        for (var i = 0; i < this.contentArray.length; i++) {
            var contentObject = this.contentArray[i];
            if (contentObject instanceof expressionBinding) {
                result += contentObject.getResult();
            } else
                result += contentObject;
        }
        return result;
    }

    processContent(content) {
        this.contentArray = this.getContentArray(content);
    }

    getContentArray(content) {
        return stringHelper.advancedSplit(content, {
            startDelimiter: startBindFunctionDelimiter,
            endDelimiter: endBindFunctionDelimiter,
            includeOutside: true,
            work: (bindFunctionContent) => {
                return new ExpressionBinding(this, this.object, this.variables, bindFunctionContent)
            }
        })

    }

    destroy() {
        for (var i = 0; i < this.contentArray.length; i++) {
            var contentObject = this.contentArray[i];
            if (contentObject instanceof ExpressionBinding)
                contentObject.destroy();
        }
    }
}


module.exports = Expression;