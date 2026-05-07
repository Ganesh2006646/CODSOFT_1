const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const STATUS_FLOW = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

// PLACE A NEW ORDER
// POST /api/orders
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress, couponCode } = req.body;

        if (req.user && req.user.role === 'admin') {
            return res.status(403).json({ message: 'Admins cannot place orders' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        let calculatedTotal = 0;
        const processedItems = [];

        for (const item of items) {
            const quantity = Number(item.quantity || 0);
            if (!item.product || quantity < 1) {
                return res.status(400).json({ message: 'Invalid product or quantity' });
            }

            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            calculatedTotal += product.price * quantity;
            processedItems.push({
                product: product._id,
                quantity,
                price: product.price,
            });
        }

        let couponToUpdate = null;
        let appliedCouponCode = undefined;
        const normalizedCoupon = couponCode ? couponCode.trim().toUpperCase() : '';

        if (normalizedCoupon) {
            const coupon = await Coupon.findOne({ code: normalizedCoupon });
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

            if (calculatedTotal < coupon.minOrder) {
                return res.status(400).json({ message: 'Cart total is below minimum order value' });
            }

            let discountAmount = 0;
            if (coupon.type === 'percent') {
                discountAmount = (calculatedTotal * coupon.value) / 100;
            } else {
                discountAmount = coupon.value;
            }

            discountAmount = Math.min(discountAmount, calculatedTotal);
            discountAmount = Number(discountAmount.toFixed(2));
            calculatedTotal = Number((calculatedTotal - discountAmount).toFixed(2));

            couponToUpdate = coupon;
            appliedCouponCode = coupon.code;
        }

        const order = await Order.create({
            user: req.user._id,
            items: processedItems,
            shippingAddress,
            totalAmount: calculatedTotal,
            paymentStatus: 'paid', // Mock payment — marking as paid
            status: 'Placed',
            statusHistory: [{ status: 'Placed', timestamp: Date.now() }],
            couponCode: appliedCouponCode,
        });

        if (couponToUpdate) {
            await Coupon.updateOne(
                { _id: couponToUpdate._id },
                { $inc: { usedCount: 1 } }
            );
        }

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

// DELETE ALL ORDERS (Admin only)
// DELETE /api/orders/clear
router.delete('/clear', protect, adminOnly, async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ message: 'All orders deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting orders', error: error.message });
    }
});

// DELETE ORDER (Admin only)
// DELETE /api/orders/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.deleteOne();
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
});

// UPDATE ORDER STATUS (Admin only)
// PATCH /api/orders/:id/status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const currentStatus = order.statusHistory.length > 0
            ? order.statusHistory[order.statusHistory.length - 1].status
            : order.status;
        const currentIndex = STATUS_FLOW.indexOf(currentStatus);
        const nextIndex = currentIndex + 1;

        if (STATUS_FLOW[nextIndex] !== status) {
            return res.status(400).json({ message: 'Invalid status transition' });
        }

        order.status = status;
        order.statusHistory.push({ status, timestamp: Date.now(), note: note || '' });
        const updated = await order.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

module.exports = router;
