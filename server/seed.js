const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');
const Order = require('./models/Order');
const CartReservation = require('./models/CartReservation');
const User = require('./models/User');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const makeHistory = (prices) => prices.map((price, index) => ({
    price,
    changedAt: daysAgo((prices.length - 1 - index) * 20),
}));

const products = [
    // ---- ELECTRONICS (8) ----
    {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise cancellation with 30 hours battery life. Soft-fit leather headband and crystal-clear hands-free calling.',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        category: 'Electronics',
        stock: 15,
        priceHistory: makeHistory([379.99, 359.99, 349.99]),
    },
    {
        name: 'Apple MacBook Air M2',
        description: 'Ultra-thin laptop with M2 chip, 13.6 inch Liquid Retina display, 8GB RAM and 256GB SSD. Up to 18 hours battery.',
        price: 1199.00,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
        category: 'Electronics',
        stock: 8,
        priceHistory: makeHistory([1249.00, 1229.00, 1199.00]),
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship phone with 200MP camera, titanium frame, built-in S Pen and 6.8 inch Dynamic AMOLED display.',
        price: 1299.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
        category: 'Electronics',
        stock: 12,
        priceHistory: makeHistory([1349.99, 1329.99, 1299.99]),
    },
    {
        name: 'Apple Watch Series 9',
        description: 'Advanced smartwatch with blood oxygen monitoring, ECG, always-on Retina display and crash detection.',
        price: 399.00,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        category: 'Electronics',
        stock: 20,
        priceHistory: makeHistory([429.00, 419.00, 399.00]),
    },
    {
        name: 'Kindle Paperwhite 16GB',
        description: 'Waterproof e-reader with 6.8 inch display and warm light. Weeks of battery life.',
        price: 159.00,
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?w=500&q=80',
        category: 'Electronics',
        stock: 22,
        priceHistory: makeHistory([179.00, 169.00, 159.00]),
    },
    {
        name: 'Logitech MX Master 3S Mouse',
        description: 'Ergonomic wireless mouse with ultra-fast scrolling and silent clicks.',
        price: 99.00,
        image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500&q=80',
        category: 'Electronics',
        stock: 30,
        priceHistory: makeHistory([109.00, 104.00, 99.00]),
    },
    {
        name: 'GoPro HERO12 Black',
        description: 'Waterproof action camera with 5.3K video, hyper smooth stabilization, and HDR.',
        price: 399.00,
        image: 'https://images.unsplash.com/photo-1519183071298-a2962be96c74?w=500&q=80',
        category: 'Electronics',
        stock: 10,
        priceHistory: makeHistory([429.00, 409.00, 399.00]),
    },
    {
        name: 'Bose SoundLink Flex',
        description: 'Portable Bluetooth speaker with deep audio and rugged, waterproof design.',
        price: 129.00,
        image: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=500&q=80',
        category: 'Electronics',
        stock: 25,
        priceHistory: makeHistory([149.00, 139.00, 129.00]),
    },

    // ---- CLOTHING (8) ----
    {
        name: "Levi's 501 Original Jeans",
        description: 'The original straight fit jeans since 1873. Premium denim with button fly and classic five-pocket styling.',
        price: 69.50,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
        category: 'Clothing',
        stock: 40,
        priceHistory: makeHistory([79.50, 74.50, 69.50]),
    },
    {
        name: 'Nike Dri-FIT Running T-Shirt',
        description: 'Lightweight moisture-wicking tee made from 100% recycled polyester. Mesh panels for extra breathability.',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
        category: 'Clothing',
        stock: 50,
        priceHistory: makeHistory([40.00, 37.00, 35.00]),
    },
    {
        name: 'Patagonia Down Jacket',
        description: 'Warm puffer jacket with 800-fill-power goose down. Windproof, water-resistant and packable into its own pocket.',
        price: 229.00,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
        category: 'Clothing',
        stock: 18,
        priceHistory: makeHistory([249.00, 239.00, 229.00]),
    },
    {
        name: 'Ray-Ban Aviator Sunglasses',
        description: 'Classic aviator sunglasses with gold metal frame and green G-15 lenses. UV400 protection.',
        price: 154.00,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
        category: 'Clothing',
        stock: 30,
        priceHistory: makeHistory([169.00, 159.00, 154.00]),
    },
    {
        name: 'Adidas Ultraboost 22 Shoes',
        description: 'Responsive running shoes with energy-returning cushion and supportive knit upper.',
        price: 180.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        category: 'Clothing',
        stock: 28,
        priceHistory: makeHistory([200.00, 190.00, 180.00]),
    },
    {
        name: 'Uniqlo Heattech Hoodie',
        description: 'Soft and warm hoodie with Heattech fabric for everyday wear.',
        price: 49.90,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
        category: 'Clothing',
        stock: 35,
        priceHistory: makeHistory([59.90, 54.90, 49.90]),
    },
    {
        name: 'Columbia Rain Jacket',
        description: 'Waterproof jacket with breathable lining and adjustable hood.',
        price: 119.00,
        image: 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?w=500&q=80',
        category: 'Clothing',
        stock: 24,
        priceHistory: makeHistory([139.00, 129.00, 119.00]),
    },
    {
        name: 'H&M Cotton Chinos',
        description: 'Slim-fit chinos made from soft cotton twill with stretch.',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1484519332611-516457305ff6?w=500&q=80',
        category: 'Clothing',
        stock: 42,
        priceHistory: makeHistory([44.99, 42.99, 39.99]),
    },

    // ---- BOOKS (7) ----
    {
        name: 'Atomic Habits by James Clear',
        description: 'A proven framework for building good habits and breaking bad ones. Over 15 million copies sold worldwide.',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
        category: 'Books',
        stock: 100,
        priceHistory: makeHistory([19.99, 18.49, 16.99]),
    },
    {
        name: 'The Psychology of Money',
        description: 'Morgan Housel explores how people think about money and teaches timeless lessons on wealth and happiness.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
        category: 'Books',
        stock: 80,
        priceHistory: makeHistory([17.99, 16.49, 14.99]),
    },
    {
        name: 'Rich Dad Poor Dad',
        description: 'Robert Kiyosaki teaches financial literacy, investing basics, and the difference between assets and liabilities.',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
        category: 'Books',
        stock: 90,
        priceHistory: makeHistory([15.99, 14.49, 12.99]),
    },
    {
        name: 'Deep Work',
        description: 'Cal Newport explains how focused work is the key to productivity and mastery.',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1455885661740-29cbf08a42fa?w=500&q=80',
        category: 'Books',
        stock: 60,
        priceHistory: makeHistory([21.50, 20.00, 18.50]),
    },
    {
        name: 'Sapiens',
        description: 'Yuval Noah Harari tells the story of human history and how we shaped the world.',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=500&q=80',
        category: 'Books',
        stock: 70,
        priceHistory: makeHistory([22.99, 21.49, 19.99]),
    },
    {
        name: 'The Alchemist',
        description: 'Paulo Coelho’s classic story about following your dreams and listening to your heart.',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
        category: 'Books',
        stock: 85,
        priceHistory: makeHistory([14.99, 13.49, 11.99]),
    },
    {
        name: 'Ikigai',
        description: 'A guide to finding your purpose and living a longer, happier life.',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80',
        category: 'Books',
        stock: 95,
        priceHistory: makeHistory([13.99, 12.49, 10.99]),
    },

    // ---- HOME & KITCHEN (7) ----
    {
        name: 'Instant Pot Duo 7-in-1',
        description: 'Electric pressure cooker that works as a slow cooker, rice cooker, steamer, warmer, and more. 6 quart capacity.',
        price: 89.95,
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80',
        category: 'Home & Kitchen',
        stock: 25,
        priceHistory: makeHistory([99.95, 94.95, 89.95]),
    },
    {
        name: 'Philips Air Fryer XXL',
        description: 'Large capacity air fryer that cooks food with up to 90% less fat. Digital touchscreen with 7 presets.',
        price: 249.99,
        image: 'https://m.media-amazon.com/images/I/51GWGjZ-TcL.jpg',
        category: 'Home & Kitchen',
        stock: 14,
        priceHistory: makeHistory([279.99, 264.99, 249.99]),
    },
    {
        name: 'Nespresso Coffee Machine',
        description: 'Compact espresso maker with 19 bar pressure. Makes barista-quality coffee at home in under 30 seconds.',
        price: 179.00,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80',
        category: 'Home & Kitchen',
        stock: 18,
        priceHistory: makeHistory([199.00, 189.00, 179.00]),
    },
    {
        name: 'Ceramic Plant Pots Set of 3',
        description: 'Minimalist matte white ceramic pots with bamboo trays. Perfect for succulents and small indoor plants.',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80',
        category: 'Home & Kitchen',
        stock: 45,
        priceHistory: makeHistory([39.99, 37.99, 34.99]),
    },
    {
        name: 'Dyson V11 Vacuum',
        description: 'Cordless vacuum with powerful suction and advanced filtration.',
        price: 499.00,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80',
        category: 'Home & Kitchen',
        stock: 12,
        priceHistory: makeHistory([549.00, 525.00, 499.00]),
    },
    {
        name: 'IKEA LACK Side Table',
        description: 'Minimalist side table that fits small spaces and modern rooms.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
        category: 'Home & Kitchen',
        stock: 60,
        priceHistory: makeHistory([19.99, 17.99, 14.99]),
    },
    {
        name: 'Lodge Cast Iron Skillet',
        description: 'Pre-seasoned cast iron skillet for searing, baking, and roasting.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&q=80',
        category: 'Home & Kitchen',
        stock: 50,
        priceHistory: makeHistory([34.99, 32.99, 29.99]),
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear old data
        await Product.deleteMany();
        await User.deleteMany();
        await Order.deleteMany();
        await CartReservation.deleteMany();
        console.log('Cleared old data');

        // Create admin user — credentials loaded from .env
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@shopease.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        await User.create({
            name: 'Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
        });
        console.log(`Created admin  → email: ${adminEmail}`);

        // Create a test customer user — credentials loaded from .env
        const testEmail = process.env.TEST_USER_EMAIL || 'john@test.com';
        const testPassword = process.env.TEST_USER_PASSWORD || 'john123';
        await User.create({
            name: 'John Doe',
            email: testEmail,
            password: testPassword,
            role: 'user',
        });
        console.log(`Created user   → email: ${testEmail}`);

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
