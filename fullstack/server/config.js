var path = require("path");

module.exports = {
	mongo: {
    url:'mongodb://localhost',
    db:'sandbox'
  },
	express: {
		port: 1234
	},
	root: path.normalize(`${__dirname}/..`),
	storage: 'storage'
}