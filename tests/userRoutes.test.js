const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/UserModel');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.setTimeout(30000); // Set the timeout to 30 seconds for Mongo DB local DB

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

describe('User Routes', () => {
    let token;
    let userId;

    beforeEach(async () => {
        const user = new User({
            name: 'Ayush yadav',
            email: 'ay@example.com',
            password: await bcrypt.hash('password123', 12),
            phone: '1234567890',
            address: '123 Main St'
        });
        const savedUser = await user.save();
        userId = savedUser._id;
        token = jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('should get user details', async () => {
        const res = await request(app)
            .get('/user')
            .set('x-auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email', 'ay@example.com');
    });

    it('should update user details', async () => {
        const res = await request(app)
            .post('/user')
            .set('x-auth-token', token)
            .send({
                name: 'Ayush Updated',
                email: 'ayushupdated@example.com',
                phone: '0987654321',
                address: '456 Another St'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Ayush Updated');
    });

    it('should delete user', async () => {
        const res = await request(app)
            .delete('/user')
            .set('x-auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User Deleted');
    });
});
