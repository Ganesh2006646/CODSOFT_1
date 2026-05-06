const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// GET ALL PRODUCTS (with search, category filter, and sorting)
// GET /api/products?search=nike&category=Electronics&sort=low
router.get('/', async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        let query = {};

        // Search by product name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Build the database query
        let productQuery = Product.find(query);

        // Sort by price
        if (sort === 'low') {
            productQuery = productQuery.sort({ price: 1 }); // Low to high
        } else if (sort === 'high') {
            productQuery = productQuery.sort({ price: -1 }); // High to low
        } else {
            productQuery = productQuery.sort({ createdAt: -1 }); // Newest first
        }

        const products = await productQuery;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// GET SINGLE PRODUCT BY ID
// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// ADD NEW PRODUCT (Admin only)
// POST /api/products
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Name, price, and category are required' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock: stock || 10,
            priceHistory: [{ price, changedAt: Date.now() }],
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});

// DELETE PRODUCT (Admin only)
// DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.deleteOne();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// UPDATE PRODUCT (Admin only)
// PATCH /api/products/:id
router.patch('/:id', protect, adminOnly, async (req, res) => {
    try {
        const updates = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (updates.price !== undefined && Number(updates.price) !== product.price) {
            product.priceHistory.push({ price: Number(updates.price), changedAt: Date.now() });
            product.price = Number(updates.price);
        }

        if (updates.name !== undefined) product.name = updates.name;
        if (updates.description !== undefined) product.description = updates.description;
        if (updates.category !== undefined) product.category = updates.category;
        if (updates.image !== undefined) product.image = updates.image;
        if (updates.stock !== undefined) product.stock = Number(updates.stock);

        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// SET FLASH SALE (Admin only)
// PATCH /api/products/:id/flashsale
router.patch('/:id/flashsale', protect, adminOnly, async (req, res) => {
    try {
        const { isActive, discountPercent, endsAt } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.flashSale = {
            isActive: Boolean(isActive),
            discountPercent: Number(discountPercent || 0),
            endsAt: endsAt ? new Date(endsAt) : null,
        };

        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating flash sale', error: error.message });
    }
});

module.exports = router;
