const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Branch = new Schema({
    name: {
        type: String,
        isRequired: true
    },
    longitude: {
        type: Number,
        isRequired: true
    },
    latitude: {
        type: Number,
        isRequired: true
    },
});

module.exports = mongoose.model('Branch', Branch, "braches"); 