const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // check for token 
    if (!token) {
        res.status(401).json({ msg: 'Unauthorized' });
    }

    try {
        //verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // Add user from payload 
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token isnt valid'})
    }
}

module.exports = auth;