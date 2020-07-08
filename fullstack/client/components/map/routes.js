var navigator = require("navigator");

navigator.page({
		title: "Globe",
		name: "globe",
		view: async () =>
			await import ("./views/globe"),
		url: '/globe'
	})
	.route();

navigator.page({
		title: "Map",
		name: "map",
		view: async () =>
			await import ("./views/clanMap"),
		url: '/map/{map._id}'
	})
	.route();

