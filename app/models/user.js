'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt-nodejs');
let titlize = require('mongoose-title-case');
let validate = require('mongoose-validator');


let nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/,
        message: 'Name format is not valid'
    }),
    validate({
        validator: 'isLength',
        arguments: [3,35],
        message: 'Name should be between {ARGS[0]} nad {ARGS[1]} characters'
    })
];

let usernameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9]+$/,
        message: 'Username format is not valid'
    }),
    validate({
        validator: 'isLength',
        arguments: [3,35],
        message: 'Username should be between {ARGS[0]} nad {ARGS[1]} characters'
    })
];

let emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Email not valid'
    })
];

let phoneValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/,
        message: 'Phone number not valid'
    })
];


let UserSchema = new Schema({
    name: {type: String, required: true, validate: nameValidator},
    lastname: {type: String, required: true, validate: nameValidator},
    username: {type: String, required: true, unique: true, validate: usernameValidator},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, validate: emailValidator},
    phone: {type: String, lowercase: true, validate: phoneValidator},
    mobile: {type: String, lowercase: true, validate: phoneValidator},
    permission: {type: String, lowercase: true, required: true, default: 'user'}
});

UserSchema.pre('save', function (next) {
    console.log('upafate as well');
    let user = this;
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

UserSchema.pre('update', function (next) {
    console.log('upafate as well');
    let user = this;
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});


UserSchema.plugin(titlize,{ paths: ['name', 'lastname']});

UserSchema.methods.comparePassword = function (password, callback) {
    return bcrypt.compare(password, this.password, function (err, isMatch) {
        callback(isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);