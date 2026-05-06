const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const CartReservation = require('../models/CartReservation');
const { protect } = require('../middleware/authMiddleware');

// GET USER CART (active reservations)
// GET /api/cart
router.get('/', protect, async (req, res) => {
    try {
        const now = new Date();
        const reservations = await CartReservation.find({
            userId: req.user._id,
            expiresAt: { $gt: now },
        }).populate('productId');

        const items = reservations.map((r) => ({
            _id: r.productId._id,
            name: r.productId.name,
            description: r.productId.description,
            price: r.productId.price,
            image: r.productId.image,
            category: r.productId.category,
            stock: r.productId.stock,
            quantity: r.quantity,
            expiresAt: r.expiresAt,
            reservationId: r._id,
        }));

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// ADD TO CART (reserve stock)
// POST /api/cart/add
router.post('/add', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = Number(quantity || 1);
        if (!productId || qty < 1) {
            return res.status(400).json({ message: 'Invalid product or quantity' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < qty) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        const now = new Date();
        const existing = await CartReservation.findOne({
            productId,
            expiresAt: { $gt: now },
        });

        if (existing && existing.userId.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Product is reserved by another user' });
        }

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        if (existing) {
            existing.quantity += qty;
            existing.expiresAt = expiresAt;
            await existing.save();
        } else {
            await CartReservation.create({
                userId: req.user._id,
                productId,
                quantity: qty,
                expiresAt,
            });
        }

        product.stock -= qty;
        product.reservedBy = { userId: req.user._id, expiresAt };
        product.reservedUntil = expiresAt;
        await product.save();

        res.json({ productId, quantity: qty, expiresAt });
    } catch (error) {
        res.status(500).json({ message: 'Error reserving cart item', error: error.message });
    }
});

// REMOVE FROM CART
// DELETE /api/cart/remove
router.delete('/remove', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const reservation = await CartReservation.findOne({ userId: req.user._id, productId });
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const qty = Number(quantity || reservation.quantity);
        if (qty < reservation.quantity) {
            reservation.quantity -= qty;
            await reservation.save();
            product.stock += qty;
        } else {
            await reservation.deleteOne();
            product.stock += reservation.quantity;
            if (product.reservedBy && product.reservedBy.userId &&
                product.reservedBy.userId.toString() === req.user._id.toString()) {
                product.reservedBy = undefined;
                product.reservedUntil = undefined;
            }
        }

        await product.save();
        res.json({ message: 'Reservation updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing cart item', error: error.message });
    }
});

module.exports = router;
