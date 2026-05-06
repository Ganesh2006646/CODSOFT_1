const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            }
        }
    ],
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered'],
        default: 'processing',
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
