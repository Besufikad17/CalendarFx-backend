const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/userModel');
const middlewares = {};


middlewares.auth = (req, res, next) => {
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

middlewares.auth_api_key = (req, res, next) => {
    const api_key = req.query.api_key;

    console.log(api_key);

    User.findOne({ api_key })
    .then(user => {
        if(user){
            user.requestes++;
            user.save();
            next();
        }else{
            return res.status(400).json({ msg: 'Invalid api key!!' });
        }
    })

}

module.exports = middlewares;