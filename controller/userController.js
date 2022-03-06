const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const apiKeyGen = require('../controller/util/util').genRanHex;
const nodemailer = require("nodemailer");
const sk = require('../config/default.json').dev_gmail_pass;
const userController = {};


userController.signup = (req, res) => {
    const { username, email, password, purpose } = req.body;
    const role = "member";

    //simple valemailation
    if (!username || !email || !password || !purpose) {
        console.log('Please enter all fields');
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    //checking for existing user
    User.findOne({ email })
        .then(user => {
            if (user) {
                console.log('user exists');
                return res.status(400).json({ msg: 'User already exists!!' });
            } else {
                const newAcccount = new User({
                    username,
                    email,
                    password,
                    purpose,
                    role,
                    api_key: apiKeyGen(16)
                })

                //create salt and hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAcccount.password, salt, (err, hash) => {
                        if (err) throw err;
                        newAcccount.password = hash;
                        newAcccount.save().
                            then(user => {
                                jwt.sign({ email: user.email }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            email: user.email,
                                            username: user.username,
                                            email: user.email,
                                            api_key: user.api_key,
                                            role: user.role
                                        }
                                    })
                                })
                            })
                    })
                })
            }
        })
}

userController.login = async (req, res) => {
    User.findOne({
        username: req.body.username,
        password: req.body.password
    }).exec((err, user) => {
        if (err) {
            res.status(400).send({ message: err });
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            jwt.sign({ user }, 'secretKey', (err, token) => {
                //console.log(token)
                let userInfo = {
                    user: user,
                    token: token
                }
                res.json(userInfo)
            })
        }
    })
}

userController.getAllUsers = async (req, res) => {
    User.find({}, function (err, users) {
        if (users) {
            res.json(users)
        }
        if (err) {
            res.json(err)
        }
    })
}

userController.getUserById = async (req, res) => {
    console.log(req.params)
    User.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, user) {
        if (user) {
            res.json(user)
        }

        if (err) {
            res.json(err)
        }
    })
}

userController.getUserByUsername = async (req, res) => {
    User.find({ username: req.params.username }, function (err, user) {
        if (user) {
            res.send(user)
        }

        if (err) {
            res.json(err)
        }
    })
}

userController.updateProfile = async (req, res) => {
    const { username, email, password } = req.body;

    //simple valemailation
    if (!username || !email || !password) {
        console.log('Please enter all fields');
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    //checking for existing user
    User.findOne({ email })
        .then(user => {
            if (user) {
                user.username = username;

                //create salt and hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user.save();
                    })
                })

                res.json({
                    user: {
                        email: user.email,
                        username: user.username,
                        email: user.email,
                        password: password,
                        api_key: user.api_key,
                        role: user.role
                    }
                })

            } else {
                return res.status(400).json({ msg: 'User doesnt exist!!' });
            }
        }).catch(err => {
            console.log(err);
        })
}

userController.changePassword = async (req, res) => {
    const { email, newPassword, comfirmedPassword } = req.body;
    const verificationCode = apiKeyGen(4);

    // valemailating field

    if (!email || !newPassword || !comfirmedPassword) {
        console.log('Please enter all fields');
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (newPassword !== comfirmedPassword) {
        console.log('Password is not same');
        return res.status(400).json({ msg: 'Password is not same' });
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'devatcalendarfx@gmail.com',
            pass:  sk
        }
    });



    //checking for existing user
    User.findOne({ email })
        .then(user => {
            if (user) {

                // send mail with defined transport object
                let info = {
                    from: 'devatcalendarfx@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: "Verification code", // Subject line
                    text: verificationCode, // plain text body
                    html: "<b>" + verificationCode.toString() + "</b>", // html body
                };
                
                transporter.sendMail(info, function(err, info){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(info.response);
                    }
                })

                //create salt and hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user.save();
                    })
                })

                res.json({
                    user: {
                        email: user.email,
                        username: user.username,
                        email: user.email,
                        password: newPassword,
                        api_key: user.api_key,
                        key: verificationCode
                    }
                })
                
            } else {
                return res.status(400).json({ msg: 'User doesnt exist!!' });
            }
        })
        .catch(err => {
            console.log(err);
        })
}

userController.removeUser = async(req,res) => {
    const { id } = req.query;
    console.log(id);

    if(!id){
        console.log('Please enter all fields');
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findByIdAndRemove({"_id" : new mongoose.Types.ObjectId(id)})
    .then(resp => {
        res.send('Done')
    })
    .catch(err => {
        console.log(err);
        return res.status(400).json({ msg : "something went wrong!!", details: err})
    })

}

module.exports = userController;