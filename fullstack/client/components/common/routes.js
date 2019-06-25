var navigator = require("navigator");

navigator.page({
		title: "Accueil",
		name: "home",
		view: () =>
			import ("./views/home"),
		url: '/'
	})
	.route();

