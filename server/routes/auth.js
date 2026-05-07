const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// REGISTER USER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const nameValue = typeof name === 'string' ? name.trim() : '';
        const emailValue = typeof email === 'string' ? email.trim() : '';
        const passwordValue = typeof password === 'string' ? password : '';

        if (!nameValue || !emailValue || !passwordValue) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const normalizedEmail = validator.normalizeEmail(emailValue);
        if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        if (!validator.isLength(passwordValue, { min: 6, max: 128 })) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            name: nameValue,
            email: normalizedEmail,
            password: passwordValue,
        });

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// LOGIN USER
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const emailValue = typeof email === 'string' ? email.trim() : '';
        const passwordValue = typeof password === 'string' ? password : '';

        if (!emailValue || !passwordValue) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = validator.normalizeEmail(emailValue);
        if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await bcrypt.compare(passwordValue, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;