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

module.exports = router;
