var VirtualEnums = require("../../../../virtualizing/Virtual/enum/");

module.exports = {
	...VirtualEnums,
	datas:require("./Datas"),
	model:require("./Model"),
	collection:require("./Collection"),
	context:require("./Context"),
	hasMany:require("./HasMany"),
	virtual:require("../../../../virtualizing/Virtual")
}