var navigator = require("navigator");

navigator.page({
		title: "Accueil",
		name: "home",
		view: async () =>
			await import ("./views/home"),
		url: '/'
	})
	.route();

navigator.page({
		title: "Accueil",
		name: "home",
		view: async () =>
			await import ("./views/cv/home"),
		url: '/cv'
	})
	.route();

