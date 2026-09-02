const Order = require('../models/Order');

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const order = await Order.create({
      user: req.user,
      items,
      totalAmount
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }) // ✅ FIX
      .sort({ createdAt: -1 });

    console.log("USER ORDERS:", orders); // 🔍 debug

    res.json(orders);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to fetch orders" });
  }
};