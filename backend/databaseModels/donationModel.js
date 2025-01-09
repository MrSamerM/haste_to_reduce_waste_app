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
        type: String,
        require: true
    },

    address: {
        type: String,
        require: true
    },

    reserved: {
        type: Boolean,
        default: false,
        require: true
    },

    donatorID: {
        type: String,
        require: true
    },

    recipientID: {
        type: String,
        require: true
    },

});

module.exports = mongoose.model("Donation", donationSchema)