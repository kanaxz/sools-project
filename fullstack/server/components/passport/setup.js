var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcryptjs");
const datas = require("../../datas");


function getUser(filter) {
    return datas.users.get().where(filter).first().execute();
}

var local = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {

        return getUser({
                email: email
            }).then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: "No user found"
                    })
                }

            })
            .catch(function(err) {
                return done(err, null)
            })
    }
);

passport.use('local', local);
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    getUser({
            _id: id
        })
        .then(user => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: "No user found"
                })
            }

        })
        .catch(function(err) {
            return done(err, null)
        })
});