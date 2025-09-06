const { z } = require('zod');
const mongoose = require("mongoose");
const registerSchema = z.object({
email: z.string().email(),
password: z.string().min(8).max(100),
username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_.-]+$/),
});
const loginSchema = z.object({
email: z.string().email(),
password: z.string().min(1),
});
const updateSchema = z
.object({
username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_.-]+$/).optional(),
password: z.string().min(8).max(100).optional(),
})
.refine((data) => Object.keys(data).length > 0, { message: 'Provide at least one field to update' });
const productCreateSchema = z.object({
title: z.string().min(1),
category: z.string().min(1),
description: z.string().optional(),
price: z.number().positive(),
image: z.string().url().optional()
});
const productUpdateSchema = z.object({
title: z.string().min(1).optional(),
category: z.string().min(1).optional(),
description: z.string().optional(),
price: z.number().positive().optional(),
image: z.string().url().optional()
}).refine((data) => Object.keys(data).length > 0, { message: 'Provide at least one field to update' });
const addToCartSchema = z.object({
productId: z.string().refine(mongoose.isValidObjectId, { message: "Invalid product id" }),
quantity: z.number().int().min(1).optional()
});
module.exports = { registerSchema, loginSchema, updateSchema, productCreateSchema, productUpdateSchema, addToCartSchema };