'use strict';

let User = require('../models/user');
let MemberOfBoard = require('../models/memberofboard');

let jwt = require('jsonwebtoken');
let secret = 'simplesecret';
let bcrypt = require('bcrypt-nodejs');

module.exports = function (router) {

    router.put('/users', function (req, res) {
        if ((req.body.newPassword || req.body.oldPassword) && req.body.newPassword !== req.body.newPasswordConfirmed) {
            res.json({success: false, message: 'New password and confirmed password are not the same'});
        } else {

            User.findOne({username: req.body.username}).select('password').exec(function (err, user) {
                if (err) throw err;
                if (!user) {
                    res.json({success: false, message: 'Username not vaild'});
                } else if (user) {
                    user.comparePassword(req.body.oldPassword, function (isMatch) {
                            if (!isMatch) {
                                res.json({success: false, message: 'Password not valid'});
                            } else {

                                user.name = req.body.name;
                                user.lastname = req.body.lastname;
                                if (req.body.newPassword) user.password = req.body.newPassword;
                                else user.password = req.body.oldPassword;
                                user.email = req.body.email;
                                user.phone = req.body.phone;
                                if (req.body.mobile) user.mobile = req.body.mobile;
                                user.save((err) => {
                                    if (err) {
                                        res.json({success: false, message: err.message});
                                    }
                                    else {
                                        let token = jwt.sign({
                                                name: user.name,
                                                lastname: user.lastname,
                                                username: req.body.username,
                                                email: user.email,
                                                phone: user.phone,
                                                mobile: user.mobile,
                                                permission: user.permission
                                            },
                                            secret,
                                            {expiresIn: '24h'});
                                        res.json({
                                            success: true,
                                            message: req.body.username + ' ist gespeichert worden.',
                                            token: token
                                        });
                                    }
                                });
                            }
                        }
                    )
                    ;
                }
            });
        }
    });


    router.post('/users', function (req, res) {
        if(req.body.password === req.body.passwordConfirmed) {
            let user = new User();
            user.name = req.body.name;
            user.lastname = req.body.lastname;
            user.username = req.body.username;
            user.password = req.body.password;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.mobile = req.body.mobile;
            user.permission = req.body.permission;
            user.save((err) => {
                if (err) {
                    res.json({success: false, message: err.message});
                }
                else {
                    res.json({success: true, message: user.username + ' ist gespeichert worden.'});
                }
            });
        }
        else{
            res.json({success: false, message: 'Password and confirmed password are not the same'});
        }
    });

    router.post('/authenticate', function (req, res) {
        User.findOne({username: req.body.username}).select('name lastname email username password phone mobile permission').exec(function (err, user) {

            if (err) throw err;
            if (!user) {
                res.json({success: false, message: 'Spitzname und/oder Kennwort unbekannt'});
            } else if (user) {
                user.comparePassword(req.body.password, function (isMatch) {
                    if (!isMatch) {
                        res.json({success: false, message: 'Spitzname und/oder Kennwort unbekannt'});
                    } else {
                        let token = jwt.sign({
                                name: user.name,
                                lastname: user.lastname,
                                username: user.username,
                                email: user.email,
                                phone: user.phone,
                                mobile: user.mobile,
                                permission: user.permission
                            },
                            secret,
                            {expiresIn: '24h'});
                        res.json({success: true, message: 'Du bist angemeldet...', token: token});
                    }
                });
            }
        });
    });


    router.use(function (req, res, next) {
        let token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({success: false, message: 'Token invalid'});
                } else {
                    req.decoded = decoded;
                    next();
                }

            })
        } else {
            res.json({success: false, message: 'No token provided'});
        }

    });

    router.post('/me', function (req, res) {
        res.send(req.decoded);
    })


    router.get('/permission', function(req, res){
        User.findOne({username: req.decoded.username}, function(err, user){
            if(err) throw err;

            if(!user){
                res.json({success: false, message:'No user was found'});
            }else{
                res.json({success: true, permission: user.permission});
            }
        });
    });


    router.get('/test', (req, res) => {
        res.send('works');
    });


    router.post('/memberofboard', (req, res) => {
        let memberOfBoard = new MemberOfBoard();
        memberOfBoard.name = req.body.name;
        memberOfBoard.midname = req.body.midname;
        memberOfBoard.lastname = req.body.lastname;
        memberOfBoard.email = req.body.email;
        let response = 'Member of board created: ' + memberOfBoard.name + ' ' + memberOfBoard.lastname;
        memberOfBoard.save((err) => {
            if (err) {
                console.log(err);
                response = 'Member of board not created!\n' + err.toLocaleString();
                res.send(response);
            }
            else {
                res.send(response);
            }
        });

    });




    return router;
}