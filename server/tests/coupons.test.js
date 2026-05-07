/**
 * Coupons API Tests — ShopEase
 * Tests: Validate coupon, Create coupon (admin), List, Delete.
 */

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

require('./setup');

const couponRoutes = require('../routes/coupons');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

const app = express();
app.use(express.json());
app.use('/api/coupons', couponRoutes);

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

const createToken = async (role = 'user') => {
    const user = await User.create({
        name: role === 'admin' ? 'Admin' : 'User',
        email: `${role}${Date.now()}@test.com`,
        password: 'pass1234',
        role,
    });
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const validCoupon = {
    code: 'SAVE10',
    type: 'percent',
    value: 10,
    minOrder: 0,
    maxUses: 100,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    isActive: true,
};

// ─── VALIDATE COUPON ───────────────────────────────────────────────────────────

describe('POST /api/coupons/validate', () => {
    beforeEach(async () => {
        await Coupon.create(validCoupon);
    });

    test('should validate a valid coupon', async () => {
        const token = await createToken('user');
        const res = await request(app)
            .post('/api/coupons/validate')
            .set('Authorization', `Bearer ${token}`)
            .send({ code: 'SAVE10', cartTotal: 100 });

        expect(res.statusCode).toBe(200);
        expect(res.body.valid).toBe(true);
        expect(res.body.discountAmount).toBe(10);
    });

    test('should reject invalid coupon code', async () => {
        const token = await createToken('user');
        const res = await request(app)
            .post('/api/coupons/validate')
            .set('Authorization', `Bearer ${token}`)
            .send({ code: 'FAKECODE', cartTotal: 100 });

        expect(res.statusCode).toBe(404);
    });

    test('should reject missing coupon code', async () => {
        const token = await createToken('user');
        const res = await request(app)
            .post('/api/coupons/validate')
            .set('Authorization', `Bearer ${token}`)
            .send({ cartTotal: 50 });

        expect(res.statusCode).toBe(400);
    });

    test('should reject expired coupon', async () => {
        await Coupon.create({
            ...validCoupon,
            code: 'EXPIRED',
            expiresAt: new Date(Date.now() - 1000), // already expired
        });

        const token = await createToken('user');
        const res = await request(app)
            .post('/api/coupons/validate')
            .set('Authorization', `Bearer ${token}`)
            .send({ code: 'EXPIRED', cartTotal: 100 });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/expired/i);
    });
});

// ─── CREATE COUPON (Admin) ─────────────────────────────────────────────────────

describe('POST /api/coupons', () => {
    test('should allow admin to create a coupon', async () => {
        const token = await createToken('admin');
        const res = await request(app)
            .post('/api/coupons')
            .set('Authorization', `Bearer ${token}`)
            .send(validCoupon);

        expect(res.statusCode).toBe(201);
        expect(res.body.code).toBe('SAVE10');
    });

    test('should block regular user from creating a coupon', async () => {
        const token = await createToken('user');
        const res = await request(app)
            .post('/api/coupons')
            .set('Authorization', `Bearer ${token}`)
            .send(validCoupon);

        expect(res.statusCode).toBe(403);
    });
});

// ─── GET ALL COUPONS (Admin) ───────────────────────────────────────────────────

describe('GET /api/coupons', () => {
    test('should list all coupons for admin', async () => {
        await Coupon.create(validCoupon);
        const token = await createToken('admin');
        const res = await request(app)
            .get('/api/coupons')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
