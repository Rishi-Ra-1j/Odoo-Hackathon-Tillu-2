const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
title: { type: String, required: true },
category: { type: String, required: true },
description: { type: String },
price: { type: Number, required: true },
image: { type: String },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const Product = mongoose.model("Product", productSchema);
module.exports = Product;