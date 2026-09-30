const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { orderId, id, items, total, customer, status } = req.body;
    const finalOrderId = orderId || id || ('PB' + Date.now());

    if (!items || !total) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    const newOrder = await Order.create({
      orderId: finalOrderId,
      items,
      total,
      customer: customer || {},
      status: status || 'Processing'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully 🎉',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
