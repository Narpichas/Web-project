const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { listUsers, deleteUser, changeUserRole, createUser } = require('../controllers/userController');

// Simple admin check middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required.' });
};

// List all users (admin only)
router.get('/', auth, isAdmin, listUsers);
// Delete user by ID (admin only)
router.delete('/:id', auth, isAdmin, deleteUser);
// Create new user (admin only)
router.post('/', auth, isAdmin, createUser);
// Change user role (admin only)
router.patch('/:id/role', auth, isAdmin, changeUserRole);

module.exports = router; 