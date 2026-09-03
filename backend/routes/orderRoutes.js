const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const Order = require('../models/Order');

router.post('/place', auth, placeOrder);
router.get('/myorders', auth, getOrders);

router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    const isOwner = order.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ msg: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to fetch order" });
  }
});

module.exports = router;