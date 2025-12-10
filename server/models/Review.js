const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        ref: 'Product' // conceptually, though Product is not a Mongoose model yet
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
