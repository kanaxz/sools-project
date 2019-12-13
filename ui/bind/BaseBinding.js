var utilities = require("../utilities");
var synchronizer = require("./synchronizer");
var stringUtils = require("sools/string/utils");
var bindHelper = require("./bindHelper");
var propertyIdentifier = "@";
var senses = {
    ASC: true,
    DESC: false
}

class BaseSegment {
    constructor(segmentOption) {
        this.observablePath = segmentOption.observablePath;
        this.index = segmentOption.index;
        this.value = segmentOption.value;
        this.contentLoaded = false;
        this.isLastSegment = false;

    }

    initialize() {
        if (this.observablePath.segments.length - 1 == this.index) {
            this.isLastSegment = true;
        } else {
            this.nextSegment = this.observablePath.segments[this.index + 1];
        }
    }

    clear() {
        this.contentLoaded = false;
        this.content = null;
    }

    updateContent() {
        if (!this.contentLoaded)
            this.loadContent();
    }

    loadContent() {
        this.content = utilities.createFunctionWrapper(this.observablePath.object, this.observablePath.variables, "return " + this.fullCleanPath)();
        this.contentLoaded = true;
    }

    ready() {

    }

    destroy() {
        this.clear();
        this.observablePath = null;
        this.index = null;
        this.value = null;
        this.fullCleanPath = null;
    }
}

class RootSegment extends BaseSegment {
    constructor(segmentOption) {
        super(segmentOption);
        this.fullCleanPath = this.value;
    }

    relativePathFrom() {
        return this.value;
    }
}
class Segment extends BaseSegment {

    constructor(segmentOption) {
        super(segmentOption);

        this.previousSegment = this.observablePath.segments[this.index - 1];
        this.fullCleanPath = this.previousSegment.fullCleanPath + "." + this.value;
    }
    relativePathFrom(otherSegment) {
        if (this.previousSegment == otherSegment) {
            return this.value;
        } else {
            return this.previousSegment.relativePathFrom(otherSegment) + "." + this.value;
        }
    }

    destroy() {
        super.destroy();
    }
}



class ObservableSegment extends Segment {
    constructor(segmentOption) {
        super(segmentOption);
        var self = this;
        this.fn = function() {
            self.changed();
        }        
    }

    initialize() {
        super.initialize();
        this.referenceSegmentRelativePath = this.relativePathFrom(this.referenceSegment);
    }

    ready() {

        super.ready();

        this.referenceSegment.updateContent();

        if (this.referenceSegment.content)
            synchronizer.watch(this.referenceSegment.content, this.referenceSegmentRelativePath, this.fn);
    }

    clear() {
        if (this.referenceSegment.content)
            synchronizer.unwatch(this.referenceSegment.content, this.referenceSegmentRelativePath, this.fn);
        super.clear()
    }

    changed() {
        this.observablePath.segmentChanged(this);
    }

    destroy() {
        super.destroy();
        this.fn = null;
    }



}


class ObservablePath {
    constructor(bindFunction, content) {
        this.bindFunction = bindFunction;
        this.content = content;
        this.segments = [];
    }

    get variables() {
        return this.bindFunction.variables;
    }

    get object() {
        return this.bindFunction.object;
    }


    start() {
        this.process();
    }

    dispatch(methodName, params, options) {
        options = options || {};
        var length = this.segments.length;
        if (options.backward) {
            var limit = options.endIndex || 0;
            for (var i = options.startIndex || length - 1; i >= limit; i--) {
                var segment = this.segments[i]; +
                segment[methodName].apply(segment, params);
            }
        } else {
            var limit = options.endIndex || length - 1;
            for (var i = options.startIndex || 0; i <= limit; i++) {
                var segment = this.segments[i];
                segment[methodName].apply(segment, params);
            }
        }
    }



    segmentChanged(changedSegment) {
        /*
        this.dispatch("clear", null, {
            endIndex: changedSegment.index + 1,
            backward: true
        });
        this.dispatch("ready", null, {
            startIndex: changedSegment.index + 1
        });
        /**/
        this.bindFunction.changed();
    }

    process() {

        var splittedContent = this.content.split(".");
        this.source = utilities.createFunctionWrapper(this.object, this.variables, "return " + splittedContent[0]);
        var ref = null;
        var flagedSegmentOption = null;
        var previousSegmentOption = null;
        var flagedSegmentOptionUsedOnce = false;
        var segmentsOptions = [];
        for (var i = 0; i < splittedContent.length; i++) {
            var segmentValue = splittedContent[i];
            var segmentOption = {
                value: stringUtils.replaceAll(segmentValue, propertyIdentifier),
                index: i,
                observablePath: this
            };

            if (i == 0) {
                segmentOption.root = true;
            } else if (segmentValue.startsWith(propertyIdentifier)) {
                var reference = previousSegmentOption;
                if (flagedSegmentOption) {
                    reference = flagedSegmentOption
                    flagedSegmentOptionUsedOnce = true;
                    flagedSegmentOption = null;
                }

                segmentOption.observable = true;
                reference.isReference = true;
            }
            if (segmentValue.endsWith(propertyIdentifier)) {
                if (!flagedSegmentOptionUsedOnce) {
                    flagedSegmentOption.observable = true;
                    flagedSegmentOption.isSelfReference = true;
                }
                flagedSegmentOption = segment;
            }

            if (i == splittedContent.length - 1) {
                if (flagedSegmentOption) {
                    if (!flagedSegmentOptionUsedOnce) {
                        flagedSegmentOption.observable = true;
                        flagedSegmentOption.isSelfReference = true;
                    }
                }

            }


            previousSegmentOption = segmentOption;
            segmentsOptions.push(segmentOption);
        }
        var lastReference = null;
        var self = this;
        segmentsOptions.forEach(function(segmentOption) {
            var segment = null;
            if (segmentOption.root) {
                segment = new RootSegment(segmentOption);
            } else if (segmentOption.observable) {
                segment = new ObservableSegment(segmentOption);
            } else {
                segment = new Segment(segmentOption)
            }
            if (segmentOption.isSelfReference)
                lastReference = segment;
            if (segmentOption.observable) {
                segment.referenceSegment = lastReference;
            }
            if (segmentOption.isReference)
                lastReference = segment;

            self.segments.push(segment);
        })

        this.dispatch("initialize");
        this.dispatch("ready");
    }

    clear() {


    }

    destroy() {
        this.dispatch("destroy", null, {
            backward: true
        })
        this.segments = null;
        this.content = null;
        this.bindFunction = null;
    }
}

class BaseBinding {
    constructor(object, variables, content) {
        this.object = object;
        this.variables = variables;
        this.observablePaths = null;
        this.fn = null;
        this.content = content;
        this.processContent(content);
    }

    start() {
        for (var i = 0; i < this.observablePaths.length; i++) {
            var observablePath = this.observablePaths[i];
            observablePath.start();
        }
    }

    processContent(content) {
        this.fn = this.getFunction(content);
        var paths = bindHelper.getPaths(content);
        this.observablePaths = [];
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            this.observablePaths.push(new ObservablePath(this, path));
        }
    }

    getFunction() {
        var fnContent = stringUtils.replaceAll(this.content, propertyIdentifier);
        if (fnContent.indexOf("return") == -1)
            fnContent = "return " + fnContent;


        var fn = utilities.createFunctionWrapper(this.object, this.variables, fnContent);
        return fn;
    }

    getResult() {
        var result = this.fn();
        return result;
    }

    changed() {
        throw new Error("You must override 'changed' in class '" + this.constructor.name + "'");
    }

    destroy() {
        for (var i = 0; i < this.observablePaths.length; i++) {
            var observablePath = this.observablePaths[i];
            observablePath.destroy();
        }
    }
}


module.exports = BaseBinding;