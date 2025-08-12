const Notification = require('../models/Notification');

// Get notifications for the current user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({
      where: { id, userId }
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json({ message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification.' });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    
    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications.' });
  }
};

// Create a notification (internal use)
const createNotification = async (userId, message, type = 'order_update', relatedOrderId = null) => {
  try {
    await Notification.create({
      userId,
      message,
      type,
      relatedOrderId,
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

module.exports = { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  createNotification 
}; 