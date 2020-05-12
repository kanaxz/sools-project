'use strict';

var passport = require("passport");
const datas = require("../datas");
var passportUtilities = {
	login: function(req, user) {
		return new Promise((resolve, reject) => {
			req.login(user, (err) => {
				if (err)
					reject(err);
				else
					resolve(user);
			})
		})
	},
	authenticate: function(req, res, next) {
		return new Promise((resolve, reject) => {
			passport.authenticate('local', function(err, dbUser, info) {
				if (err)
					reject(err);
				else if (!dbUser)
					reject(new Error("User not found"));
				else resolve(dbUser);
			})(req, res, next);
		}).then((user) => {
			return passportUtilities.login(user);
		})
	},
	logout: function(req) {
		return new Promise((resolve, reject) => {
			req.logout();
			req.session.destroy(err => {
				if (err)
					reject(err)
				else
					resolve();
			});
		})
	}
}

module.exports.me = function(req, res, next) {
	return res.json({user:req.user || null});
}

module.exports.signin = function(req, res, next) {
	passportUtilities.authenticate(req, res, next)
		.then((user) => {
			req.status(200).json(user);
		}).catch((err) => {
			req.status(500).json(err);
		})
}

module.exports.logout = function(req, res, next) {
	passportUtilities.logout(req).then(() => {
		req.status(200).json();
	}).catch((err) => {
		req.status(500).json(err);
	});
}

module.exports.signup = function(req, res, next) {
	console.log(req.body)
	datas.users.add(req.body).execute((user) => {
		return passportUtilities.login(req, user);
	}).then((user) => {
		res.status(200).json(user);
	}).catch((err) => {
		res.status(500).json(err);
	})
}