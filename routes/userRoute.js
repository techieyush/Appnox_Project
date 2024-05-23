const { Router } = require('express');
const { genSalt, hash: _hash } = require('bcryptjs');
const auth = require('../middlewares/authMiddleware');
const User = require('../models/UserModel');
const { UserRegisterSchema } = require('../models/ValidateSchema');

const router = Router();

// User : Insert / Update endpoint
router.post('/', auth, async (req, res) => {
    const { error } = UserRegisterSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ errors: error.details });
    }

    const { name, email, password, phone, address } = req.body;
    let user = await User.findById(req.user.id);
    if (user) {
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.address = address;
        await user.save();
        return res.json(user);
    }

    const salt = await genSalt(12);
    const hashedPassword = await _hash(password, salt);

    user = new User({
        _id: req.user.id,
        name,
        email,
        password: hashedPassword,
        phone,
        address
    });
    await user.save();
    res.json(user);
});

// User: GetById endpoint 
router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

// User: Delete endpoint 
router.delete('/', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await User.deleteOne({ _id: req.user.id });
    res.json({ message: 'User Deleted' });
});

module.exports = router;