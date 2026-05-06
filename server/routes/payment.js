const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// MOCK PAYMENT — simulates a payment process
// POST /api/payment/create-intent
// In a real app, this would create a Stripe PaymentIntent
router.post('/create-intent', protect, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid payment amount' });
        }

        // Simulate a successful payment response
        // In production, you would use: stripe.paymentIntents.create({ amount, currency })
        const mockPaymentIntent = {
            id: 'pi_mock_' + Date.now(),
            amount: amount,
            currency: 'usd',
            status: 'succeeded',
        };

        res.json({
            success: true,
            paymentIntent: mockPaymentIntent,
        });
    } catch (error) {
        res.status(500).json({ message: 'Payment processing error', error: error.message });
    }
});

module.exports = router;
