const mongoose = require("mongoose");
const cartItemSchema = mongoose.Schema({
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
quantity: { type: Number, default: 1, min: 1 }
});
const cartSchema = mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
items: [cartItemSchema]
});
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;