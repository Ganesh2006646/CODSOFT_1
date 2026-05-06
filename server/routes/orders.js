const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// PLACE A NEW ORDER
// POST /api/orders
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount,
            paymentStatus: 'paid', // Mock payment — marking as paid
            status: 'processing',
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});

// GET MY ORDERS (logged-in user)
// GET /api/orders/my
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// GET ALL ORDERS (Admin only)
// GET /api/orders
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

module.exports = router;
