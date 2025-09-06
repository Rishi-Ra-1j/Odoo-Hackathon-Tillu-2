const mongoose = require("mongoose");
const orderItemSchema = mongoose.Schema({
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
quantity: { type: Number, required: true },
price: { type: Number, required: true }
});
const orderSchema = mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
items: [orderItemSchema],
total: { type: Number, required: true },
createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;