'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let validate = require('mongoose-validator');

let planeValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9\s]+$/,
        message: 'Plane name format is not valid'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 35],
        message: 'Plane name should be between {ARGS[0]} nad {ARGS[1]} characters'
    })
];


let registrationValidator = [
    validate({
        validator: 'matches',
        arguments: /^[A-Z]{1,2}[-][a-zA-Z0-9]{3,4}$/,
        message: 'Plane registration format is not valid'
    }),
    validate({
        validator: 'isLength',
        arguments: [4, 7],
        message: 'Plane registration should be between {ARGS[0]} nad {ARGS[1]} characters'
    })
];

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

let GliderBookingSchema = new Schema({
    name: {type: String, required: true, validate: nameValidator},
    lastname: {type: String, required: true, validate: nameValidator},
    email: {type: String, required: true, validate: emailValidator},
    date: {type: Date, required: true},
    plane: {type: String, required: true, validate: planeValidator},
    registration: {type: String, required: true, validate: registrationValidator}
});

GliderBookingSchema.index({date: 1, registration: 1}, {unique: true});


module.exports = mongoose.model('GliderBooking', GliderBookingSchema);