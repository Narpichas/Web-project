const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { listOrders, placeOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');

// Simple admin check middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required.' });
};

// List all orders (admin only)
router.get('/', auth, isAdmin, listOrders);

// Place a new order (authenticated user)
router.post('/', auth, placeOrder);

// Get orders for the current authenticated user
router.get('/mine', auth, getMyOrders);

// Update order status (admin only)
router.patch('/:id/status', auth, isAdmin, updateOrderStatus);

module.exports = router; 