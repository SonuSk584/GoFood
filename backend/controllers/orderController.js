const Order = require('../models/Order');
const Food = require('../models/Food');

// PLACE ORDER (cash-on-delivery path — no payment step, so this is the
// checkout flow that most needs server-side price validation; nothing
// stops a client from claiming any totalAmount otherwise)
exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "No items in order" });
    }

    // Recompute the real total from actual Food prices — never trust
    // client-sent prices or totalAmount, same reasoning as
    // paymentController.verifyPayment.
    const foodIds = items.map(item => item._id || item.foodId);
    const foods = await Food.find({ _id: { $in: foodIds } });

    if (foods.length !== items.length) {
      return res.status(400).json({ msg: "One or more items in this order no longer exist" });
    }

    let totalAmount = 0;
    const verifiedItems = items.map(item => {
      const food = foods.find(f => f._id.toString() === String(item._id || item.foodId));

      if (!food.available) {
        throw new Error(`"${food.name}" is currently unavailable`);
      }

      const quantity = Number(item.quantity) || 1;
      totalAmount += food.price * quantity;

      return {
        foodId: food._id,
        name: food.name,
        price: food.price,
        quantity
      };
    });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const order = await Order.create({
      userId: req.user.id,
      items: verifiedItems,
      totalAmount,
      otp,
      otpVerified: false
    });

    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message || "Failed to place order" });
  }
};

// GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to fetch orders" });
  }
};