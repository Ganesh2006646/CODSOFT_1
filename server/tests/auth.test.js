/**
 * Auth API Tests — ShopEase
 * Tests: Register, Login, validation, JWT token issuance.
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Set JWT_SECRET before any module loads it
process.env.JWT_SECRET = process.env.JWT_SECRET || 'shopease_test_secret_key_32chars';

// Load shared in-memory DB setup
require('./setup');

const authRoutes = require('../routes/auth');

// Minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// ─── REGISTER ──────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
    test('should register a new user and return JWT token', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'test@example.com', password: 'pass1234' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe('test@example.com');
        expect(res.body.role).toBe('user');
    });

    test('should reject registration with missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: '', email: '', password: '' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    test('should reject registration with invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'not-an-email', password: 'pass1234' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/invalid email/i);
    });

    test('should reject registration with password < 6 chars', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'short@example.com', password: '123' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/at least 6 characters/i);
    });

    test('should reject duplicate email registration', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ name: 'First', email: 'dup@example.com', password: 'pass1234' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Second', email: 'dup@example.com', password: 'pass1234' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/already exists/i);
    });
});

// ─── LOGIN ─────────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        // Register a user before login tests
        await request(app)
            .post('/api/auth/register')
            .send({ name: 'Login User', email: 'login@example.com', password: 'pass1234' });
    });

    test('should login with correct credentials and return token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'login@example.com', password: 'pass1234' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe('login@example.com');
    });

    test('should reject login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'login@example.com', password: 'wrongpass' });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/invalid email or password/i);
    });

    test('should reject login with non-existent email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'ghost@example.com', password: 'pass1234' });

        expect(res.statusCode).toBe(401);
    });

    test('should reject login with missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: '', password: '' });

        expect(res.statusCode).toBe(400);
    });
});
