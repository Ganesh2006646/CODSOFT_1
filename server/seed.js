const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const products = [
    // ---- ELECTRONICS (4) ----
    {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise cancellation with 30 hours battery life. Soft-fit leather headband and crystal-clear hands-free calling.',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        category: 'Electronics',
        stock: 15,
    },
    {
        name: 'Apple MacBook Air M2',
        description: 'Ultra-thin laptop with M2 chip, 13.6 inch Liquid Retina display, 8GB RAM and 256GB SSD. Up to 18 hours battery.',
        price: 1199.00,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
        category: 'Electronics',
        stock: 8,
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship phone with 200MP camera, titanium frame, built-in S Pen and 6.8 inch Dynamic AMOLED display.',
        price: 1299.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
        category: 'Electronics',
        stock: 12,
    },
    {
        name: 'Apple Watch Series 9',
        description: 'Advanced smartwatch with blood oxygen monitoring, ECG, always-on Retina display and crash detection.',
        price: 399.00,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        category: 'Electronics',
        stock: 20,
    },

    // ---- CLOTHING (4) ----
    {
        name: "Levi's 501 Original Jeans",
        description: 'The original straight fit jeans since 1873. Premium denim with button fly and classic five-pocket styling.',
        price: 69.50,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
        category: 'Clothing',
        stock: 40,
    },
    {
        name: 'Nike Dri-FIT Running T-Shirt',
        description: 'Lightweight moisture-wicking tee made from 100% recycled polyester. Mesh panels for extra breathability.',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
        category: 'Clothing',
        stock: 50,
    },
    {
        name: 'Patagonia Down Jacket',
        description: 'Warm puffer jacket with 800-fill-power goose down. Windproof, water-resistant and packable into its own pocket.',
        price: 229.00,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
        category: 'Clothing',
        stock: 18,
    },
    {
        name: 'Ray-Ban Aviator Sunglasses',
        description: 'Classic aviator sunglasses with gold metal frame and green G-15 lenses. UV400 protection.',
        price: 154.00,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
        category: 'Clothing',
        stock: 30,
    },

    // ---- BOOKS (3) ----
    {
        name: 'Atomic Habits by James Clear',
        description: 'A proven framework for building good habits and breaking bad ones. Over 15 million copies sold worldwide.',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
        category: 'Books',
        stock: 100,
    },
    {
        name: 'The Psychology of Money',
        description: 'Morgan Housel explores how people think about money and teaches timeless lessons on wealth and happiness.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
        category: 'Books',
        stock: 80,
    },
    {
        name: 'Rich Dad Poor Dad',
        description: 'Robert Kiyosaki teaches financial literacy, investing basics, and the difference between assets and liabilities.',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
        category: 'Books',
        stock: 90,
    },

    // ---- HOME & KITCHEN (4) ----
    {
        name: 'Instant Pot Duo 7-in-1',
        description: 'Electric pressure cooker that works as a slow cooker, rice cooker, steamer, warmer, and more. 6 quart capacity.',
        price: 89.95,
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80',
        category: 'Home & Kitchen',
        stock: 25,
    },
    {
        name: 'Philips Air Fryer XXL',
        description: 'Large capacity air fryer that cooks food with up to 90% less fat. Digital touchscreen with 7 presets.',
        price: 249.99,
        image: 'https://m.media-amazon.com/images/I/51GWGjZ-TcL.jpg',
        category: 'Home & Kitchen',
        stock: 14,
    },
    {
        name: 'Nespresso Coffee Machine',
        description: 'Compact espresso maker with 19 bar pressure. Makes barista-quality coffee at home in under 30 seconds.',
        price: 179.00,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80',
        category: 'Home & Kitchen',
        stock: 18,
    },
    {
        name: 'Ceramic Plant Pots Set of 3',
        description: 'Minimalist matte white ceramic pots with bamboo trays. Perfect for succulents and small indoor plants.',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80',
        category: 'Home & Kitchen',
        stock: 45,
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear old data
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Cleared old data');

        // Create admin user
        await User.create({
            name: 'Admin',
            email: 'admin@shopease.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log('Created admin  → email: admin@shopease.com  password: admin123');

        // Create a test customer user
        await User.create({
            name: 'John Doe',
            email: 'john@test.com',
            password: 'john123',
            role: 'user',
        });
        console.log('Created user   → email: john@test.com       password: john123');

        // Insert products
        await Product.insertMany(products);
        console.log(`Added ${products.length} products across 4 categories`);

        console.log('\nSeeding complete!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err.message);
        process.exit(1);
    }
};

seedDatabase();
