var path = require("path");

module.exports = {
	mongo: {
		url:'mongodb://localhost:27017',
		db:'zenyo'
	},
	express: {
		port: 1234
	},
	root: path.normalize(`${__dirname}/..`),
	storage: 'storage'
}