var navigator = require("navigator");
var authService = require("./authService");
navigator.page({
		title: "Authentification",
		url: '/auth/',
		name: "auth",
		view: () =>
			import ("./views/auth")
	})
	.route().then((query) => {
		if (authService.me)
			throw "Already logged in";
		return query;
	})