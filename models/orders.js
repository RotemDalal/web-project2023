const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    purchaseDate: Date,
    quantity: Number
});

module.exports = mongoose.model('Purchase', purchaseSchema);
