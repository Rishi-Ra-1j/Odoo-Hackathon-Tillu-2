require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { auth } = require("./middleware/auth");
const { registerSchema, loginSchema, updateSchema, productCreateSchema, productUpdateSchema, addToCartSchema } = require("./validation/schemas");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
// connect db
connectDB();
function signToken(user) {
return jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: "4d" });
}
function asyncHandler(fn) {
return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
app.get("/check", (req, res) => res.json({ status: "ok" }));
// Register
app.post(
"/api/auth/register",
asyncHandler(async (req, res) => {
const parsed = registerSchema.safeParse(req.body);
if (!parsed.success) {
return res.status(400).json({ errors: parsed.error.flatten() });
}
const { email, password, username } = parsed.data;
const existing = await User.findOne({ email });
if (existing) {
return res.status(409).json({ message: "Already Registered!" });
}
const hash = await bcrypt.hash(password, 12);
const user = await User.create({ email, username, password: hash });
const token = signToken(user);
res.status(201).json({ token, user });
})
);
// Login
app.post(
"/api/auth/login",
asyncHandler(async (req, res) => {
const parsed = loginSchema.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
const { email, password } = parsed.data;
const user = await User.findOne({ email }).select("+password");
if (!user) return res.status(401).json({ message: "Invalid email or password" });
const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ message: "Invalid email or password" });
user.password = undefined;
const token = signToken(user);
res.json({ token, user });
})
);
// Get current user
app.get(
"/api/auth/me",
auth,
asyncHandler(async (req, res) => {
const user = await User.findById(req.user.id);
if (!user) return res.status(404).json({ message: "User not found" });
res.json({ user });
})
);
// Update user
app.put(
"/api/users/:id",
auth,
asyncHandler(async (req, res) => {
const { id } = req.params;
if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
if (id !== req.user.id) return res.status(403).json({ message: "You can only update your own profile" });
const parsed = updateSchema.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
const update = { ...parsed.data };
if (update.password) update.password = await bcrypt.hash(update.password, 12);
const updated = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
if (!updated) return res.status(404).json({ message: "User not found" });
res.json({ user: updated });
})
);
// Create new product listing (protected)
app.post(
"/api/products",
auth,
asyncHandler(async (req, res) => {
const parsed = productCreateSchema.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
const product = await Product.create({ ...parsed.data, owner: req.user.id });
res.status(201).json({ product });
})
);
// Get all products (supports q, category, pagination)
app.get(
"/api/products",
asyncHandler(async (req, res) => {
const { q, category, page = 1, limit = 10 } = req.query;
const query = {};
if (category) query.category = category;
if (q) query.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
const products = await Product.find(query)
.skip((page - 1) * limit)
.limit(parseInt(limit))
.populate('owner', 'username');
const total = await Product.countDocuments(query);
res.json({ products, total, page, limit });
})
);
// Get product details
app.get(
"/api/products/:id",
asyncHandler(async (req, res) => {
const { id } = req.params;
if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid product id" });
const product = await Product.findById(id).populate('owner', 'username');
if (!product) return res.status(404).json({ message: "Product not found" });
res.json({ product });
})
);
// Edit product (only owner)
app.put(
"/api/products/:id",
auth,
asyncHandler(async (req, res) => {
const { id } = req.params;
if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid product id" });
const product = await Product.findById(id);
if (!product) return res.status(404).json({ message: "Product not found" });
if (product.owner.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });
const parsed = productUpdateSchema.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
const updated = await Product.findByIdAndUpdate(id, parsed.data, { new: true });
res.json({ product: updated });
})
);
// Delete product (only owner)
app.delete(
"/api/products/:id",
auth,
asyncHandler(async (req, res) => {
const { id } = req.params;
if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid product id" });
const product = await Product.findById(id);
if (!product) return res.status(404).json({ message: "Product not found" });
if (product.owner.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });
await product.deleteOne();
res.json({ message: "Product deleted" });
})
);
// Get current user’s listings (protected)
app.get(
"/api/my/products",
auth,
asyncHandler(async (req, res) => {
const products = await Product.find({ owner: req.user.id });
res.json({ products });
})
);
// Get current user’s cart (protected)
app.get(
"/api/cart",
auth,
asyncHandler(async (req, res) => {
let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
if (!cart) {
cart = await Cart.create({ user: req.user.id, items: [] });
}
res.json({ cart });
})
);
// Add item to cart (protected)
app.post(
"/api/cart/items",
auth,
asyncHandler(async (req, res) => {
const parsed = addToCartSchema.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
const { productId, quantity = 1 } = parsed.data;
const product = await Product.findById(productId);
if (!product) return res.status(404).json({ message: "Product not found" });
let cart = await Cart.findOne({ user: req.user.id });
if (!cart) {
cart = await Cart.create({ user: req.user.id, items: [] });
}
const existingItem = cart.items.find(item => item.product.toString() === productId);
if (existingItem) {
existingItem.quantity += quantity;
} else {
cart.items.push({ product: productId, quantity });
}
await cart.save();
await cart.populate('items.product');
res.json({ cart });
})
);
// Remove item from cart (protected)
app.delete(
"/api/cart/items/:id",
auth,
asyncHandler(async (req, res) => {
const { id } = req.params;
if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid product id" });
let cart = await Cart.findOne({ user: req.user.id });
if (!cart) return res.status(404).json({ message: "Cart not found" });
cart.items = cart.items.filter(item => item.product.toString() !== id);
await cart.save();
await cart.populate('items.product');
res.json({ cart });
})
);
// Clear entire cart (protected)
app.delete(
"/api/cart",
auth,
asyncHandler(async (req, res) => {
const cart = await Cart.findOne({ user: req.user.id });
if (cart) {
cart.items = [];
await cart.save();
}
res.json({ message: "Cart cleared" });
})
);
// Convert cart to order (protected)
app.post(
"/api/checkout",
auth,
asyncHandler(async (req, res) => {
let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });
const items = cart.items.map(item => ({
product: item.product._id,
quantity: item.quantity,
price: item.product.price
}));
const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const order = await Order.create({ user: req.user.id, items, total });
cart.items = [];
await cart.save();
res.status(201).json({ order });
})
);
// Get all past orders (protected)
app.get(
"/api/orders",
auth,
asyncHandler(async (req, res) => {
const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
res.json({ orders });
})
);
// Get details of one order (protected)
app.get(
"/api/orders/:id",
auth,
asyncHandler(async (req, res) => {
const { id } = req.params;
if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid order id" });
const order = await Order.findById(id).populate('items.product');
if (!order) return res.status(404).json({ message: "Order not found" });
if (order.user.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });
res.json({ order });
})
);
app.use((err, req, res, next) => {
console.error(err);
if (res.headersSent) return next(err);
res.status(500).json({ message: "Internal Server Error" });
});
app.listen(port);