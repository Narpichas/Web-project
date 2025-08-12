const User = require('../models/User');
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    { expiresIn: '7d' }
  );
}

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, username, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });
    const user = await User.create({ email, password, username, firstName, lastName });
    const token = generateToken(user);
    res.status(201).json({ user: user.toPublicJSON(), token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });
    const token = generateToken(user);
    res.json({ user: user.toPublicJSON(), token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

// Get current user (protected route)
const getCurrentUser = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login, getCurrentUser }; 