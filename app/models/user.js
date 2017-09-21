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
        message: 'Name is probably not valid'
    }),
    validate({
        validator: 'isLength',
        arguments: [3,35],
        message: 'Name should be between {ARGS[0]} nad {ARGS[1]} characters'
    })
];

let emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    })
];

let phoneValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i
    })
];


let UserSchema = new Schema({
    name: {type: String, required: true, validate: nameValidator},
    lastname: {type: String, required: true, validate: nameValidator},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, validate: emailValidator},
    phone: {type: String, lowercase: true, validate: phoneValidator},
    mobile: {type: String, lowercase: true, validate: phoneValidator}
});

UserSchema.pre('save', function (next) {
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