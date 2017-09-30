'use strict';

const User = require('../models/user');
const Plane = require('../models/plane');
const jwt = require('jsonwebtoken');
const secret = 'simplesecret';
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

module.exports = function (router) {
    dotenv.load();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);


    router.get('/planes', function(req, res){
       Plane.find(function(err, planes){
           if (err) {
               res.json({success: false, message: err});
           } else {
               res.json({success: true, message: planes});
           }
       });
    });

    router.get('/users', function (req, res) {
        User.find({}).select('name lastname username email mobile phone permission active').sort({lastname: 'asc'}).exec(function (err, users) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                res.json({success: true, message: users});
            }
        })
    });

    //update permission and active flag only
    router.put('/users/permissions', function (req, res) {
        User.findOne({email: req.body.email}).select('permission active').exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({success: false, message: 'EMail not valid'});
            } else if (user) {
                user.permission = req.body.permission;
                user.active = req.body.active;
                user.save((err) => {
                    if (err) {
                        res.json({success: false, message: err.message});
                    }
                    else {
                        res.json({
                            success: true,
                            message: 'Berechtigungen für ' + req.body.lastname + ' ' + req.body.name +  ' sind gespeichert worden.'
                        });
                    }
                });
            }
        });
    });


    //update
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

    //activateAccount
    router.put('/users/activate', function (req, res) {
        console.log(req.body.password);
        console.log(req.body.passwordConfirmed);
        if (req.body.password !== req.body.passwordConfirmed) {
            res.json({success: false, message: 'New password and confirmed password are not the same'});
        } else {
            if (req.body.temporaryToken) {
                User.findOne({temporaryToken: req.body.temporaryToken}, function (err, user) {
                    if (err) throw err;
                    if (!user) {
                        console.log(req.body.temporaryToken);
                        res.json({success: false, message: 'temporary token not valid'});
                    } else if (user) {

                        if (req.body.password !== req.body.passwordConfirmed) {
                            res.json({success: false, message: 'Password not valid'});
                        } else {
                            user.name = req.body.name;
                            user.lastname = req.body.lastname;
                            user.username = req.body.username;
                            user.password = req.body.password;
                            user.email = req.body.email;
                            user.phone = req.body.phone;
                            user.mobile = req.body.mobile;
                            user.temporaryToken = false;
                            user.active = true;
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
                });
            } else {
                res.json({success: false, message: 'Temporary token is invalid'});
            }
        }
    });

//create(register)
    router.post('/users', function (req, res) {
        if (req.body.password === req.body.passwordConfirmed) {
            let user = new User();
            user.name = req.body.name;
            user.lastname = req.body.lastname;
            user.username = req.body.username;
            user.password = req.body.password;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.mobile = req.body.mobile;
            user.permission = req.body.permission;
            user.temporaryToken = jwt.sign({
                    name: user.name,
                    lastname: user.lastname,
                    username: req.body.username,
                    email: user.email,
                    phone: user.phone,
                    mobile: user.mobile,
                    permission: user.permission
                },
                secret,
                {expiresIn: '72h'});

            user.save((err) => {
                if (err) {
                    res.json({success: false, message: err.message});
                }
                else {
                    const msg = {
                        to: user.email,
                        from: 'mail@it-bernat.de',
                        subject: 'Registration link',
                        text: 'Hi, please activate your account within next 3 days',
                        html: '<strong><a href="http://localhost:8080/activate/' + user.temporaryToken + '">http://localhost:8080/activate</a></strong>'
                    };
                    sgMail.send(msg, function (err, info) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    res.json({success: true, message: 'Registration link was sent to ' + user.email});


                }
            });
        }
        else {
            res.json({success: false, message: 'Password and confirmed password are not the same'});
        }
    });

    router.post('/authenticate', function (req, res) {
        User.findOne({username: req.body.username}).select('name lastname email username password phone mobile permission active').exec(function (err, user) {

            if (err) throw err;
            if (!user) {
                res.json({success: false, message: 'Spitzname und/oder Kennwort unbekannt'});
            } else if (user) {
                user.comparePassword(req.body.password, function (isMatch) {
                    if (!isMatch) {
                        res.json({success: false, message: 'Spitzname und/oder Kennwort unbekannt'});
                    } else if (!user.active) {
                        res.json({success: false, message: 'User not activated'});
                    }
                    else {
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
            res.json({success: false, message: 'No token providedd'});
        }

    });

    //activation link -> first entry into the system
    router.put('/activate', function (req, res) {
        let token = req.headers['x-access-token'];
        console.log(token);
        User.findOne({temporaryToken: token}, function (err, user) {
            if (err) throw err;
            if (token) {
                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.json({success: false, message: 'Token expired'});
                    } else if (!user) {
                        res.json({success: false, message: 'Token expired'});
                    } else {
                        res.json({success: true, message: 'Account OK', email: user.email});
                    }
                });
            } else {
                res.json({success: false, message: 'No token provided'});
            }
        });
    });

    router.post('/me', function (req, res) {
        res.send(req.decoded);
    })


    router.get('/permission', function (req, res) {
        User.findOne({username: req.decoded.username}, function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({success: false, message: 'No user was found'});
            } else {
                res.json({success: true, permission: user.permission});
            }
        });
    });


    router.get('/test', (req, res) => {
        res.send('works');
    });


    return router;
}