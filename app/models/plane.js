'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let validate = require('mongoose-validator');

let nameValidator = [
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

let plane_typeValidator = [
    validate({
        validator: 'matches',
        arguments: /\bGLIDER\b|\bTMG\b$/,
        message: 'Plane type format is not valid'
    })
];

let PlaneSchema = new Schema({
    name: {type: String, required: true, validate: nameValidator},
    registration: {type: String, required: true, unique: true, validate: registrationValidator},
    cleared: {type: Boolean, required: true, default: true},
    plane_type: {type: String, required: true, validate: plane_typeValidator}
});


module.exports = mongoose.model('Plane', PlaneSchema);