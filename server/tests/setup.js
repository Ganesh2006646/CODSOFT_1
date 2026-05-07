/**
 * Jest Test Setup — ShopEase API
 * Shared in-memory MongoDB setup for all test suites.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Boot in-memory MongoDB before all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

// Clean all collections between tests to ensure isolation
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// Disconnect and stop in-memory server after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
