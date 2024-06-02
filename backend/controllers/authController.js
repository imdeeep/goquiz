const User = require('../models/Users');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Signup User
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
        });

        // Password Hashing
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        // Saving the user in the database
        await user.save();

        // Return Jwt
        const payload = {
            user: {
                id: user.id,
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
            res.json({ token });
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Return JWT
        const payload = {
            user: {
                id: user.id,
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
            res.json({ msg: 'Login Successful', token });
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Server Error');
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Invalid token',error });
    }
};