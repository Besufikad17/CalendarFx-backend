const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const auth = {};
const config = require('config');
const auth_middleware = require('../middleware/auth');

auth.auth = async (req, res) => {
    const { username, password } = req.body;

    //simple validation
    if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    //checking for existing user
    User.findOne({ username })
        .then(user => {
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist!!' });
            } else {
                //Validating password
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) return res.status(400).json({ msg: "invalid credentials" })
                        jwt.sign({ id: user.id }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    username: user.username,
                                    email: user.email,
                                    password: password,
                                    api_key: user.api_key
                                }
                            })
                        })
                    })
            }
        })
}

auth.getCurrentUser = async(req,res) =>{
    User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user))
}

module.exports = auth;