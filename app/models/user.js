'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt-nodejs');

let UserSchema = new Schema({
    name: {type: String, lowercase: false, required: true, unique: false},
    lastname: {type: String, lowercase: false, required: true, unique: false},
    username: {type: String, lowercase: false, required: true, unique: true},
    password: {type: String, lowercase: false, required: true, unique: false},
    email: {type: String, lowercase: true, required: true, unique: true},
    phone: {type: String, lowercase: true, required: false, unique: false},
    mobile: {type: String, lowercase: true, required: false, unique: false}
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

UserSchema.methods.comparePassword = function (password, callback) {
    return bcrypt.compare(password, this.password, function (err, isMatch) {
        callback(isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);