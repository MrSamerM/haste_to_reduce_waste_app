
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    productImage: {
        type: String,
        require: true
    },
    productName: {
        type: String,
        require: true
    },
    pointCost: {
        type: Number,
        require: true
    },

    quantity: {
        type: Number,
        default: 100,
        require: true
    },

});

module.exports = mongoose.model("Product", productSchema)