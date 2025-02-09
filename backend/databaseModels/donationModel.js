// https://javascript.plainenglish.io/node-js-models-and-database-3836f0c7f2da referenced for assistance
// https://mongoosejs.com/docs/schematypes.html referenced for assistance

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({

    image: {
        type: String,
        require: true
    },

    description: {
        type: String,
        require: true
    },

    portionSize: {
        type: Number,
        require: true
    },

    address: {
        type: String,
        require: true
    },

    longitude: {
        type: Number,
        require: true
    },

    latitude: {
        type: Number,
        require: true
    },

    reserved: {
        type: Boolean,
        default: false,
        require: true
    },

    donatorID: {
        type: mongoose.Schema.Types.ObjectID, ref: "User",
        require: true
    },

    recipientID: {
        type: mongoose.Schema.Types.ObjectID, ref: "User",
        default: null,
        require: true
    },

});

module.exports = mongoose.model("Donation", donationSchema)