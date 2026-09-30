const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [
    {
      name: String,
      price: Number,
      qty: Number
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'Processing' },
  customer: {
    name: String,
    phone: String,
    address: String,
    city: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
