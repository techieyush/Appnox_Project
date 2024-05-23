const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/UserModel');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

jest.setTimeout(60000); // Set the timeout to 60 seconds for Mongo DB local DB

let mongoServer;

beforeAll(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret_key';
    process.env.PORT = 3000;
    
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('Auth Routes', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                name: 'Ayush Yadav',
                email: 'ay@example.com',
                password: 'password123',
                phone: '1234567890',
                address: '123 Main St'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
        const user = new User({
            name: 'Aa Yy',
            email: 'ay@example.com',
            password: await bcrypt.hash('password123', 12),
            phone: '0987654321',
            address: '456 Another St'
        });
        await user.save();

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'ay@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'invalid@example.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid Password');
    });
});
