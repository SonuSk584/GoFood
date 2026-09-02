const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// 🟢 Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR"
    };

    const order = await razorpay.orders.create(options);

    console.log("RAZORPAY ORDER:", order);   // ✅ ADD HERE

    res.json(order);

  } catch (err) {
    console.log("ERROR:", err);   // ✅ also add this
    res.status(500).json({ error: err.message });
  }
};

// 🔐 Verify Payment (CRITICAL)
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalAmount,
      userId
    } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    console.log("BODY:", req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Payment verification failed" });
    }
    console.log("SAVING ORDER...");
    // ✅ Save order AFTER verification
    const order = await Order.create({
      userId: userId,
      items,
      totalAmount,
      status: "Paid",
      otp:otp,
      otpVerified:false
    });
    console.log("ORDER SAVED:", order);

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};