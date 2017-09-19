'use strict';

let User = require('../models/user');
let MemberOfBoard = require('../models/memberofboard');

module.exports = function (router) {

    router.post('/users', (req, res) => {
        let user = new User();

        user.name = req.body.name;
        user.lastname = req.body.lastname;
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;

        user.save((err) => {
            if (err) {
                res.json({success: false, message: 'Spitzname ' + user.username + ' existiert schon.'});
            }
            else {
                res.json({success: true, message: user.username + ' ist gespeichert worden.'});
            }
        });
    });

    router.post('/authenticate', function(req, res){
        User.findOne({username: req.body.username}).select('email username password').exec(function(err, user){

            if (err) throw err;
            if (!user) {
                res.json({success: false, message: 'Could not authenticate user'});
            } else if (user) {
                user.comparePassword(req.body.password, function(isMatch){
                    if (!isMatch) {
                        res.json({success: false, message: 'Could not authenticate pwd'});
                    } else {
                        res.json({success: true, message: 'User is authorized'});
                    }
                });
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