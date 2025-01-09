// https://javascript.plainenglish.io/node-js-models-and-database-3836f0c7f2da referenced for assistance
// https://mongoosejs.com/docs/schematypes.html referenced for assistance

const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({

    userID: {
        type: String,
        require: true
    },

    productID: {
        type: String,
        require: true
    },

    cost: {
        type: Number,
        require: true
    },

});

module.exports = mongoose.model("Receipt", receiptSchema)