var express = require('express');
var path = require("path");
var config = require('./config');

var bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var passport = require("passport");
var cookieParser = require('cookie-parser');
var config = require("./config");
var app = express();


app.set('appPath', path.join(config.root, 'build'));
app.set('storagePath', path.join(config.root, 'storage'));
app.set('assetsPath', path.join(config.root, 'assets'));
app.use(express.static(app.get('appPath')));
//app.use(express.logger('dev')); 
app.set('view engine', 'html');

app.use(session({
    secret: 'G854Eaf64EA84gmolq84',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        url: config.mongo.url + "/" + config.mongo.db
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
/**/
module.exports = app;