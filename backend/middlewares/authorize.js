const UserModel = require('../models/UserModel');
const jwt = require("../library/jwt");

module.exports = (request, response, next) => {

    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    if (request.headers.authorization) {
        let decoded = jwt.verifyAccessToken(request.headers.authorization.substr(7))
        if (decoded) {
            UserModel.getById(decoded.id, (user) => {
                request.currentUser = user;
                next();
            });
        } else {
            return response.status(403).json({
                message: 'Invalid token'
            });
        }
    } else {
        // if there is no authorization header
        return response.status(403).json({
            message: 'Invalid token'
        });
    }
};