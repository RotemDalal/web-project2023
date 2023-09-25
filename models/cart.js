const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  products: [
    {
      productId: Number,
      quantity: Number, 
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);

