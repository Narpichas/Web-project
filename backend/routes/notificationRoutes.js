const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

// Get user notifications
router.get('/', auth, getUserNotifications);

// Mark notification as read
router.patch('/:id/read', auth, markAsRead);

// Mark all notifications as read
router.patch('/read-all', auth, markAllAsRead);

module.exports = router; 