'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let validate = require('mongoose-validator');


let nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/,
        message: 'Name format is not valid'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 35],
        message: 'Name should be between {ARGS[0]} nad {ARGS[1]} characters'
    })
];

let emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Email not valid'
    })
];

let TeacherToTrainingSchema = new Schema({
    "name": {type: String, required: true, validate: nameValidator},
    "lastname": {type: String, required: true, validate: nameValidator},
    "email": {type: String, required: true, validate: emailValidator},
    "date": {type: Date, required: true},
    "comment": {type: String}
});


module.exports = mongoose.model('TeacherToTraining', TeacherToTrainingSchema);