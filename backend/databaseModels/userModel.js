
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: String,
        required: true
    },

    points: {
        type: Number,
        default: 0,
        required: true
    },

});

module.exports = mongoose.model("User", userSchema)