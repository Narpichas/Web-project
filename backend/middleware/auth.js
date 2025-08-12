const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
    console.log('Decoded token:', decoded);
    const user = await User.findOne({ where: { id: decoded.userId } });
    console.log('Looking for user with ID:', decoded.userId);
    console.log('Found user:', user ? user.id : 'null');
    console.log('User object:', user ? JSON.stringify(user.toJSON()) : 'null');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user.toPublicJSON();
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = auth; 