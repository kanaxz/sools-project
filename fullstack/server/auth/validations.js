module.exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(500).json({
            message: "Unauthorized: user is not logged in"
        });
    }
}

module.exports.isAnonymous = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.status(500).json({
            message: "User already logged in"
        });
    } else {
        return next();
    }
}