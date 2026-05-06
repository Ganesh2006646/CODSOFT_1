const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    reservedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        expiresAt: {
            type: Date,
        }
    },
    reservedUntil: {
        type: Date,
    },
    flashSale: {
        isActive: {
            type: Boolean,
            default: false,
        },
        discountPercent: {
            type: Number,
            default: 0,
        },
        endsAt: {
            type: Date,
        }
    },
    priceHistory: [
        {
            price: {
                type: Number,
            },
            changedAt: {
                type: Date,
                default: Date.now,
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
