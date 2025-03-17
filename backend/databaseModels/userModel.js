// https://javascript.plainenglish.io/node-js-models-and-database-3836f0c7f2da referenced for assistance
// https://mongoosejs.com/docs/schematypes.html referenced for assistance

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