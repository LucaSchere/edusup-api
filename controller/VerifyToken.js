var jwt = require('jsonwebtoken');
var config = require('../config/config');
function verifyToken(req, res, next) {
    var token = req.body.jwt;
    if (!token)
        return res.status(403).send({ success: false, message: 'No token provided.' });
    jwt.verify(token, config.server_secret, function(err, decoded) {
        if (err)
            return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });
        // if everything good, save to request for use in other routes
        req.data = decoded;
        next();
    });
}
module.exports = verifyToken;