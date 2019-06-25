var utils = {
	getDistance: function(p1, p2) {
		var a = p1.x - p2.x
		var b = p1.y - p2.y
		return Math.sqrt(a * a + b * b);
	}
}

module.exports = utils;