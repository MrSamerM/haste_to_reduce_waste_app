
// Tim. (2014) Creating a Foreign Key relationship in Mongoose. Available at:
// https://stackoverflow.com/questions/26008555/creating-a-foreign-key-relationship-in-mongoose (Accessed: 3 February 2025) 

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