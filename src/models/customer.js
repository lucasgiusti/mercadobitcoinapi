'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    roles: [{
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: 'user'
    }]
});

module.exports = mongoose.model('customer', schema);