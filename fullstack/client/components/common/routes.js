var navigator = require("navigator");

navigator.page({
		title: "Accueil",
		name: "home",
		view: async () =>
			await import ("./views/home"),
		url: '/'
	})
	.route();

