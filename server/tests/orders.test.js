/**
 * Orders API Tests — ShopEase
 * Tests: Place order, Get my orders, Admin order management.
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('./setup');

const orderRoutes = require('../routes/orders');
const authRoutes = require('../routes/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

const sampleAddress = {
    street: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
};

// Helper: create tokens
const createToken = async (role = 'user') => {
    const user = await User.create({
        name: role === 'admin' ? 'Admin' : 'Customer',
        email: `${role}${Date.now()}@test.com`,
        password: 'pass1234',
        role,
    });
    return {
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
        userId: user._id,
    };
};

// Helper: create a product and return its id
const createProduct = async () => {
    const p = await Product.create({
        name: 'Test Item',
        description: 'A product',
        price: 50.00,
        category: 'Books',
        stock: 100,
    });
    return p._id;
};

// ─── PLACE ORDER ───────────────────────────────────────────────────────────────

describe('POST /api/orders', () => {
    test('should place an order successfully', async () => {
        const { token } = await createToken('user');
        const productId = await createProduct();

        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [{ product: productId, quantity: 2 }],
                shippingAddress: sampleAddress,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('Placed');
        expect(res.body.totalAmount).toBe(100);
    });

    test('should reject order with empty items', async () => {
        const { token } = await createToken('user');

        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ items: [], shippingAddress: sampleAddress });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/no items/i);
    });

    test('should not allow admin to place an order', async () => {
        const { token } = await createToken('admin');
        const productId = await createProduct();

        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [{ product: productId, quantity: 1 }],
                shippingAddress: sampleAddress,
            });

        expect(res.statusCode).toBe(403);
    });

    test('should reject unauthenticated order', async () => {
        const productId = await createProduct();

        const res = await request(app)
            .post('/api/orders')
            .send({
                items: [{ product: productId, quantity: 1 }],
                shippingAddress: sampleAddress,
            });

        expect(res.statusCode).toBe(401);
    });
});

// ─── GET MY ORDERS ─────────────────────────────────────────────────────────────

describe('GET /api/orders/my', () => {
    test('should return orders for logged-in user', async () => {
        const { token, userId } = await createToken('user');
        const productId = await createProduct();

        await Order.create({
            user: userId,
            items: [{ product: productId, quantity: 1, price: 50 }],
            shippingAddress: sampleAddress,
            totalAmount: 50,
            paymentStatus: 'paid',
            status: 'Placed',
            statusHistory: [{ status: 'Placed', timestamp: new Date() }],
        });

        const res = await request(app)
            .get('/api/orders/my')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });

    test('should return empty array if no orders', async () => {
        const { token } = await createToken('user');
        const res = await request(app)
            .get('/api/orders/my')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

// ─── ADMIN: GET ALL ORDERS ─────────────────────────────────────────────────────

describe('GET /api/orders (admin)', () => {
    test('should allow admin to fetch all orders', async () => {
        const { token } = await createToken('admin');
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('should block non-admin from fetching all orders', async () => {
        const { token } = await createToken('user');
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(403);
    });
});
