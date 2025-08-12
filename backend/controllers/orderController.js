const Order = require('../models/Order');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// List all orders (admin only)
const listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, attributes: ['id', 'email', 'role'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};


const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required.' });
    }
    if (!total || isNaN(total)) {
      return res.status(400).json({ error: 'Order total is required.' });
    }
    const order = await Order.create({ userId, items, total, status: 'pending' });
    
  
    await createNotification(
      userId,
      `Your order #${order.id} has been placed successfully and is pending approval. Total: ₨${total}`,
      'order_update',
      order.id
    );
    
    res.status(201).json({ message: 'Order placed!', order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to place order.' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your orders.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'paid', 'shipped', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be pending, paid, shipped, or cancelled.' });
    }
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    
    const oldStatus = order.status;
    order.status = status;
    await order.save();
    
    
    let message = '';
    switch (status) {
      case 'paid':
        message = `Great news! Your order #${order.id} has been approved and payment confirmed. We're preparing it for shipment.`;
        break;
      case 'shipped':
        message = `Your order #${order.id} has been shipped! You'll receive it soon.`;
        break;
      case 'cancelled':
        message = `Your order #${order.id} has been cancelled. If you have any questions, please contact support.`;
        break;
      case 'pending':
        if (oldStatus === 'cancelled') {
          message = `Your order #${order.id} has been reopened and is pending approval.`;
        }
        break;
    }
    
    if (message) {
      await createNotification(
        order.userId,
        message,
        'order_update',
        order.id
      );
    }
    
    res.json({ message: 'Order status updated successfully.', order });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

module.exports = { listOrders, placeOrder, getMyOrders, updateOrderStatus }; 