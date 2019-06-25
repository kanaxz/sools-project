var PromiseFactory = require("./PromiseFactory");
var stringHelper = require("sools/string/utils");
var pathHelper = require("sools-ui/pathHelper");
var OPTIONAL_SEGMENT_PATTERN = "?:";
var OPTIONAL_SEGMENT_SEPARATOR = ",";
var OPTIONAL_SEGMENT_COMPARER = "=";
class RouteSegment {

	constructor(value) {
		this.value = value;
		var split = this.value.split(".");
		this.modelName = split[0];
		this.propertyName = split[1];
	}

	stringify(models) {
		return pathHelper.get(models, this.value);
	}

	parse(models, value) {
		models[this.modelName].parseProperty(this.propertyName, value);
	}
}

class OptionalRouteSegment {
	constructor(value) {
		this.value = value;
		this.segments = [];
		var split = this.value.replace(OPTIONAL_SEGMENT_PATTERN, "").split(OPTIONAL_SEGMENT_SEPARATOR);
		for (var innerSegment of split) {
			this.segments.push(new RouteSegment(innerSegment));
		}
	}

	stringify(models) {
		var result = "";
		var first = true;
		for (var segment of this.segments) {
			if (!first)
				result += OPTIONAL_SEGMENT_SEPARATOR;
			try {
				result += segment.property + OPTIONAL_SEGMENT_COMPARER + segment.interpolate(models);
				first = false;
			} catch (e) {
				continue;
			}
		}

		return (result);
	}

	parse(models, segment) {
		var split = segment.split(OPTIONAL_SEGMENT_SEPARATOR);
		split.forEach((param) => {
			var subSplit = param.split(OPTIONAL_SEGMENT_COMPARER);
			var propertyName = subSplit[0];
			var value = subSplit[1];
			var segment = this.getSegmentByPropertyName(propertyName);
			if (segment) {
				segment.parse(models, value);
			}
		})
	}

	getSegmentByPropertyName(propertyName) {
		return this.segments.find((segment) => {
			return segment.propertyName == propertyName;
		})
	}
}


class Route extends PromiseFactory {
	constructor(page, options) {
		super();
		this.page = page;
		this.options = options;
		this.segments = [];
		this.singleModel = options.model;

		
		if (this.singleModel)
			this.singleModelName = options.modelName || stringHelper.minuscule(this.singleModel.name)
		this.hasModel = (this.singleModel || options.models);


		if (this.hasModel) {
			this.models = this.singleModel ? {
				[this.singleModelName]: this.singleModel
			} : options.models;
			
			for (var modelName in this.models) {
				var model = this.models[modelName];
				if (!(model.prototype instanceof Rikat.model))
					this.models[modelName] = class extends Rikat.model {}.properties(model);
			}
		}
		this.options.url.split("/").filter((s) => {
			return s
		}).forEach((segment) => {
			var paths = stringHelper.advancedSplit(segment, {
				startDelimiter: "{{",
				endDelimiter: "}}"
			});
			if (paths.length != 0) {
				var segment = paths[0];
				if (segment.startsWith(OPTIONAL_SEGMENT_PATTERN))
					this.segments.push(new OptionalRouteSegment(segment));
				else
					this.segments.push(new RouteSegment(segment));
			} else
				this.segments.push(segment);
		})
	}

	getParam(models) {
		return this.singleModel ? models[this.singleModelName] : models;
	}

}


module.exports = Route;