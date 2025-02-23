// https://javascript.plainenglish.io/node-js-models-and-database-3836f0c7f2da referenced for assistance
// https://mongoosejs.com/docs/schematypes.html referenced for assistance
// https://stackoverflow.com/questions/26008555/creating-a-foreign-key-relationship-in-mongoose answered by Tim 03/02/2025 for foreign key

const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({

    userID: {
        type: mongoose.Schema.Types.ObjectID, ref: "User",
        require: true
    },

    productID: [{
        type: mongoose.Schema.Types.ObjectID, ref: "Product",
        require: true
    }],

    cost: {
        type: Number,
        require: true
    },

    address: {
        type: String,
        require: true
    },

});

module.exports = mongoose.model("Receipt", receiptSchema)