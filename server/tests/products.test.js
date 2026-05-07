/**
 * Products API Tests — ShopEase
 * Tests: GET all, GET by ID, POST (admin), PATCH, DELETE.
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('./setup');

const productRoutes = require('../routes/products');
const authRoutes = require('../routes/auth');
const Product = require('../models/Product');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// JWT_SECRET for test token generation
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

// Helper: create an admin token
const makeAdminToken = async () => {
    const admin = await User.create({
        name: 'Admin',
        email: 'admin@test.com',
        password: 'admin1234',
        role: 'admin',
    });
    return jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Helper: create a regular user token
const makeUserToken = async () => {
    const user = await User.create({
        name: 'User',
        email: 'user@test.com',
        password: 'user1234',
        role: 'user',
    });
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Sample product data
const sampleProduct = {
    name: 'Test Headphones',
    description: 'Great audio quality.',
    price: 99.99,
    category: 'Electronics',
    image: 'https://example.com/headphones.jpg',
    stock: 20,
};

// ─── GET ALL PRODUCTS ──────────────────────────────────────────────────────────

describe('GET /api/products', () => {
    test('should return empty array when no products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('should return all products', async () => {
        await Product.create(sampleProduct);
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Test Headphones');
    });

    test('should filter products by category', async () => {
        await Product.create(sampleProduct);
        await Product.create({ ...sampleProduct, name: 'Jeans', category: 'Clothing' });

        const res = await request(app).get('/api/products?category=Electronics');
        expect(res.statusCode).toBe(200);
        expect(res.body.every(p => p.category === 'Electronics')).toBe(true);
    });

    test('should search products by name', async () => {
        await Product.create(sampleProduct);
        const res = await request(app).get('/api/products?search=headphone');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });
});

// ─── GET SINGLE PRODUCT ────────────────────────────────────────────────────────

describe('GET /api/products/:id', () => {
    test('should return a single product by valid ID', async () => {
        const product = await Product.create(sampleProduct);
        const res = await request(app).get(`/api/products/${product._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Test Headphones');
    });

    test('should return 404 for non-existent product', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/products/${fakeId}`);
        expect(res.statusCode).toBe(404);
    });
});

// ─── ADD PRODUCT (Admin Only) ──────────────────────────────────────────────────

describe('POST /api/products', () => {
    test('should allow admin to create a product', async () => {
        const token = await makeAdminToken();
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send(sampleProduct);

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Test Headphones');
    });

    test('should reject product creation without auth', async () => {
        const res = await request(app).post('/api/products').send(sampleProduct);
        expect(res.statusCode).toBe(401);
    });

    test('should reject product creation by regular user', async () => {
        const token = await makeUserToken();
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send(sampleProduct);
        expect(res.statusCode).toBe(403);
    });

    test('should reject product with missing required fields', async () => {
        const token = await makeAdminToken();
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'No name or price' });
        expect(res.statusCode).toBe(400);
    });
});
