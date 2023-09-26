const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    userId: String,
    purchaseDate: Date,
    quantity: Number
});

module.exports = mongoose.model('Purchase', purchaseSchema);
