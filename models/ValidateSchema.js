const Joi = require('joi');

// Define custom error messages
const messages = {
    name: {
        'string.empty': 'Name is required'
    },
    email: {
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required'
    },
    password: {
        'string.min': 'Please provide a strong password',
        'string.empty': 'Password is required'
    },
    phone: {
        'string.empty': 'Phone Number is required'
    },
    address: {
        'string.empty': 'Address is required'
    }
};

// Define User Register Schema
const UserRegisterSchema = Joi.object({
    name: Joi.string().required().messages(messages.name),
    email: Joi.string().required().email().messages(messages.email),
    password: Joi.string().required().messages(messages.password),
    phone: Joi.string().required().messages(messages.phone),
    address: Joi.string().required().messages(messages.address)
});

// Define User Login Schema
const UserLoginSchema = Joi.object({
    email: Joi.string().required().email().messages(messages.email),
    password: Joi.string().required().messages(messages.password)
});

module.exports = { UserRegisterSchema, UserLoginSchema };