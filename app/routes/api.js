'use strict';

const User = require('../models/user');
const Plane = require('../models/plane');
const GliderBooking = require('../models/glider_booking');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const secret = 'simplesecret';
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;


module.exports = function (router) {
    dotenv.load();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);


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

    //activateAccount
    router.put('/users/activate', function (req, res) {
        if (req.body.password !== req.body.passwordConfirmed) {
            res.json({success: false, message: 'New password and confirmed password are not the same'});
        } else {
            if (req.body.temporaryToken) {
                User.findOne({temporaryToken: req.body.temporaryToken}, function (err, user) {
                    if (err) throw err;
                    if (!user) {
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
                res.json({success: false, message: 'Temporary token ist ungültig'});
            }
        }
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
            res.json({success: false, message: 'Kein Token'});
        }

    });

    //update
    router.put('/planes', function (req, res) {
        console.log(req);
        Plane.findOne({'registration': req.body.registration}).exec(function (err, plane) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (plane) {
                    plane.cleared = req.body.cleared;
                    plane.save((err) => {
                        if (err) {
                            res.json({success: false, message: err.message});
                        }
                        else {
                            res.json({
                                success: true,
                                message: 'Flugtauglichkeit für ' + req.body.name + ' ' + req.body.registration + ' ist gespeichert worden.'
                            });
                        }
                    });
                }else{
                    res.json({success: false, message: 'Flugzeug ' + req.body.name + ' ' + req.body.registration + ' nicht gefunden.' });
                }
            }
        });
    });


    router.post('/booking', function (req, res) {

        let dates = [];
        let startDate = moment(req.body.till_date);
        let endDate = moment(req.body.untill_date);

        if (moment.isMoment(startDate) && startDate.isAfter(moment()) && moment.isMoment(endDate) &&
            endDate.isSameOrAfter(startDate) && endDate.diff(startDate, 'days') <= 30) {


            User.findOne({
                email: req.body.email,
                active: true
            }).select('permission').exec(function (err, user) {
                    if (user !== null && user !== undefined && user.permission.split(',').indexOf('manager') >= 0) {
                        let where =
                            {
                                date: {$gte: startDate, $lte: endDate},
                                registration: req.body.registration,
                                plane_type: req.body.plane_type
                            };


                        GliderBooking.findOne(where).exec(function (err, booking) {
                            if (booking === null) {
                                while (startDate <= endDate) {
                                    dates.push(startDate.clone());
                                    startDate.add(moment.duration(1, 'day'));
                                }

                                let promises = [];
                                for (let i = 0; i < dates.length; i++) {
                                    let date = dates[i];
                                    let gliderBooking = new GliderBooking();
                                    gliderBooking.name = req.body.name;
                                    gliderBooking.lastname = req.body.lastname;
                                    gliderBooking.email = req.body.email;
                                    gliderBooking.date = date;
                                    gliderBooking.plane = req.body.plane;
                                    gliderBooking.registration = req.body.registration;
                                    gliderBooking.comment = req.body.comment;
                                    gliderBooking.plane_type = req.body.plane_type;
                                    promises.push(gliderBooking.save());
                                }

                                Promise.all(promises)
                                    .then(function (values) {
                                        const msg = {
                                            to: req.body.email,
                                            from: 'mail@it-bernat.de',
                                            subject: 'Buchung - Segelflugzeug',
                                            text: 'Du hast ein Segelflugzeug gebucht!',
                                            html: '<strong> Du hast folgende Leistungen gebucht:' + req.body.plane + ', ' + req.body.registration + ', von ' +
                                            moment(req.body.till_date).format('DD.MM.YYYY') + ' bis ' + moment(req.body.untill_date).format('DD.MM.YYYY') + '</strong>'
                                        };
                                        /*sgMail.send(msg, function (err, info) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });*/
                                        res.json({
                                            success: true,
                                            message: "Du hast ein Segelflugzeug gebucht: " + req.body.plane + " " + req.body.registration + ', von ' +
                                            moment(req.body.till_date).format('DD.MM.YYYY') + ' bis ' + moment(req.body.untill_date).format('DD.MM.YYYY')
                                        });
                                    })
                                    .catch(function (reason) {
                                        //todo remove
                                        res.json({success: false, message: reason});
                                    });
                            } else {

                                res.json({
                                    success: false,
                                    message: 'Diese Buchung ist leider nicht möglich, da in dem gewünschten Zeitraum bereits eine Buchung liegt!'
                                });
                            }

                        });
                    }
                    else {

                        let where = {email: req.body.email, plane_type: req.body.plane_type};
                        GliderBooking.find(where).exec(function (err, booking) {
                            let allowValue = 0;
                            let allowValueText = 'ein';
                            if(req.body.plane_type === 'TMG'){
                                if(user.permission.split(',').indexOf('fi') >= 0){
                                    allowValue = 3;
                                    allowValueText = 'vier';
                                }else{
                                    allowValue = 1;
                                    allowValueText = 'zwei';
                                }
                            }

                            if (booking === null || booking.length <= allowValue) {
                                let where = {
                                    date: {$gte: startDate, $lte: endDate},
                                    registration: req.body.registration
                                };

                                GliderBooking.findOne(where).exec(function (err, booking) {
                                    if (booking === null) {
                                        while (startDate <= endDate) {
                                            dates.push(startDate.clone());
                                            startDate.add(moment.duration(1, 'day'));
                                        }

                                        let promises = [];
                                        for (let i = 0; i < dates.length; i++) {
                                            let date = dates[i];
                                            let gliderBooking = new GliderBooking();
                                            gliderBooking.name = req.body.name;
                                            gliderBooking.lastname = req.body.lastname;
                                            gliderBooking.email = req.body.email;
                                            gliderBooking.date = date;
                                            gliderBooking.plane = req.body.plane;
                                            gliderBooking.registration = req.body.registration;
                                            gliderBooking.comment = req.body.comment;
                                            gliderBooking.plane_type = req.body.plane_type;
                                            promises.push(gliderBooking.save());
                                        }

                                        Promise.all(promises)
                                            .then(function (values) {
                                                const msg = {
                                                    to: req.body.email,
                                                    from: 'mail@it-bernat.de',
                                                    subject: 'Buchung - Segelflugzeug',
                                                    text: 'Du hast ein Segelflugzeug gebucht!',
                                                    html: '<strong> Du hast folgende Leistungen gebucht:' + req.body.plane + ', ' + req.body.registration + ', von ' +
                                                    moment(req.body.till_date).format('DD.MM.YYYY') + ' bis ' + moment(req.body.untill_date).format('DD.MM.YYYY') + '</strong>'
                                                };
                                                /*sgMail.send(msg, function (err, info) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });*/
                                                res.json({
                                                    success: true,
                                                    message: "Du hast ein Segelflugzeug gebucht: " + req.body.plane + " " + req.body.registration + ', von ' +
                                                    moment(req.body.till_date).format('DD.MM.YYYY') + ' bis ' + moment(req.body.untill_date).format('DD.MM.YYYY')
                                                });
                                            })
                                            .catch(function (reason) {
                                                //todo remove
                                                res.json({success: false, message: reason});
                                            });

                                    } else {
                                        res.json({
                                            success: false,
                                            message: 'Diese Buchung ist leider nicht möglich, da in dem gewünschten Zeitraum bereits eine Buchung liegt!'
                                        });
                                    }
                                });

                            } else {
                                res.json({success: false, message: 'Du kannst nicht mehr als ' + allowValueText + ' mal buchen!'});
                            }
                        });


                    }
                }
            );

        }
        else {
            res.json({
                success: false,
                message: 'Zeitraum nich gültig: Start: ' + startDate.format('DD.MM.YYYY') + ' Ende: ' + endDate.format('DD.MM.YYYY')
            });
        }
    });


    router.delete('/booking', function (req, res) {

        GliderBooking.remove({
            date: req.body.date,
            email: req.body.email,
            registration: req.body.registration
        }, function (err) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                const msg = {
                    to: req.body.email,
                    from: 'mail@it-bernat.de',
                    subject: 'Löschung der Buchung - Segelflugzeug',
                    text: 'Du hast eine Buchung gelöscht!',
                    html: '<strong> Du hast eine Buchung gelöscht: ' + req.body.plane + ', ' + req.body.registration + '</strong>'
                };
                /*sgMail.send(msg, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                });*/
                res.json({
                    success: true,
                    message: 'Du hast eine Buchung gelöscht: ' + req.body.plane + ', ' + req.body.registration + ', ' + moment(req.body.date).format('DD.MM.YYYY')
                });
            }
        });
    });

    router.get('/booking/:plane_type', function (req, res) {
        GliderBooking.find({plane_type: req.params.plane_type, date: {$gte: moment().add(-1, 'days')}}).select('date plane registration email name lastname comment').sort({date: 'asc'}).exec(function (err, bookings) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                res.json({success: true, message: bookings});
            }
        });
    });


    router.get('/planes/:plane_type', function (req, res) {
        Plane.find({plane_type: req.params.plane_type}).exec(function (err, planes) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                res.json({success: true, message: planes});
            }
        });
    });

    router.get('/planes', function (req, res) {
        Plane.find({}).exec(function (err, planes) {
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
                res.json({success: false, message: 'Email nicht gültig'});
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
                            message: 'Berechtigungen für ' + req.body.lastname + ' ' + req.body.name + ' sind gespeichert worden.'
                        });
                    }
                });
            }
        });
    });


//update
    router.put('/users', function (req, res) {
        if ((req.body.newPassword || req.body.oldPassword) && req.body.newPassword !== req.body.newPasswordConfirmed) {
            res.json({success: false, message: 'Neues und altes Kennwort sind nicht gleich'});
        } else {

            User.findOne({username: req.body.username}).select('password').exec(function (err, user) {
                if (err) throw err;
                if (!user) {
                    res.json({success: false, message: 'Username nicht gültig'});
                } else if (user) {
                    user.comparePassword(req.body.oldPassword, function (isMatch) {
                            if (!isMatch) {
                                res.json({success: false, message: 'Kennwort nicht gültig'});
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
        if (req.body.password !== req.body.passwordConfirmed) {
            res.json({success: false, message: 'Neues und altes Kennowrt sind nicht gleich!'});
        } else {
            if (req.body.temporaryToken) {
                User.findOne({temporaryToken: req.body.temporaryToken}, function (err, user) {
                    if (err) throw err;
                    if (!user) {
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
                res.json({success: false, message: 'Temporary token ist ungültig'});
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
                        text: 'Hallo, Konnto bitte innerhal 3 Tagen aktivieren',
                        html: '<strong><a href="http://localhost:8080/activate/' + user.temporaryToken + '">http://localhost:8080/activate</a></strong>'
                    };
                    sgMail.send(msg, function (err, info) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    res.json({success: true, message: 'Registrationslink ist zu ' + user.email + ' gesendet worden.'});


                }
            });
        }
        else {
            res.json({success: false, message: 'Neues und altes Kennowrt sind nicht gleich!'});
        }
    });


//activation link -> first entry into the system
    router.put('/activate', function (req, res) {
        let token = req.headers['x-access-token'];
        User.findOne({temporaryToken: token}, function (err, user) {
            if (err) throw err;
            if (token) {
                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.json({success: false, message: 'Token abgelaufen'});
                    } else if (!user) {
                        res.json({success: false, message: 'Token abgelaufen'});
                    } else {
                        res.json({success: true, message: 'Konto OK', email: user.email});
                    }
                });
            } else {
                res.json({success: false, message: 'Kein token'});
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
                res.json({success: false, message: 'Username nicht bekannt'});
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