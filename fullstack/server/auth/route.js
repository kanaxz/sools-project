'use strict';
var express = require('express');
var controller = require('./controller');
var router = express.Router();
var auth = require("./validations")
router.post('/signin',auth.isAnonymous, controller.signin);
router.post('/logout',auth.isLoggedIn, controller.logout);
router.post('/signup',auth.isAnonymous, controller.signup);
router.get("/me",controller.me);
module.exports = router;