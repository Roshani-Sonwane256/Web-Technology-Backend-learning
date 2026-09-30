const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET || 'pink_basket_secret', {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! 🌸',
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Demo fallback: create user automatically if missing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const name = email.split('@')[0];
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      
      const createdUser = await User.create({ name: formattedName, email, password: hashedPassword });
      const token = jwt.sign({ id: createdUser._id, email: createdUser.email }, process.env.JWT_SECRET || 'pink_basket_secret', { expiresIn: '7d' });

      return res.json({
        success: true,
        message: `Welcome to Pink Basket, ${createdUser.name}! 🌸`,
        user: { id: createdUser._id, name: createdUser.name, email: createdUser.email },
        token
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'pink_basket_secret', { expiresIn: '7d' });

    res.json({
      success: true,
      message: `Welcome back, ${user.name}! 🌸`,
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
