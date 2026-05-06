const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// VALIDATE COUPON
// POST /api/coupons/validate
router.post('/validate', protect, async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ message: 'Coupon is inactive' });
        }

        if (coupon.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Coupon is expired' });
        }

        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        if (Number(cartTotal || 0) < coupon.minOrder) {
            return res.status(400).json({ message: 'Cart total is below minimum order value' });
        }

        let discount = 0;
        if (coupon.type === 'percent') {
            discount = (Number(cartTotal) * coupon.value) / 100;
        } else {
            discount = coupon.value;
        }

        res.json({
            valid: true,
            discountAmount: Number(discount.toFixed(2)),
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error validating coupon', error: error.message });
    }
});

// CREATE COUPON (Admin only)
// POST /api/coupons
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { code, type, value, minOrder, maxUses, expiresAt, isActive } = req.body;
        const coupon = await Coupon.create({
            code,
            type,
            value,
            minOrder,
            maxUses,
            expiresAt,
            isActive,
        });
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error creating coupon', error: error.message });
    }
});

// GET COUPONS (Admin only)
// GET /api/coupons
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coupons', error: error.message });
    }
});

// DELETE COUPON (Admin only)
// DELETE /api/coupons/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        await coupon.deleteOne();
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting coupon', error: error.message });
    }
});

module.exports = router;
