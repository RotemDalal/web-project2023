const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    price: Number,
    image: String,
    kosher: Boolean,
    alcoholPercentage: Number,
    volume: Number,
    type: String,
    drySweet: String,
    grapeVarieties: String,
});

module.exports = mongoose.model('Product', productSchema);
