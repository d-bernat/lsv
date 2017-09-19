'use strict';


let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MemberOfBoardSchema = new Schema({
    name: { type: String, lowercase: false, required: true, unique: false },
    midname: { type: String, lowercase: false, required: false, unique: false },
    lastname: { type: String, lowercase: false, required: true, unique: false },
    email:    { type: String, lowercase: true, required: true, unique: true }
});


module.exports = mongoose.model('MemberOfBoard', MemberOfBoardSchema);