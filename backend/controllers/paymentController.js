const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Food = require("../models/Food");

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
    res.json(order);

  } catch (err) {
    console.log("Create order error:", err.message);
    res.status(500).json({ error: "Could not create payment order" });
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
      totalAmount
    } = req.body;

    // 1) Verify the signature proves this response really came from Razorpay
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    // timingSafeEqual instead of !== — avoids leaking how many characters
    // matched via response-time differences (minor, but it's the
    // recommended way to compare secrets/signatures).
    const signatureValid =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

    if (!signatureValid) {
      return res.status(400).json({ msg: "Payment verification failed" });
    }

    // 2) Recompute what this order SHOULD cost, from the real Food prices
    // in the database — never trust the client's item prices or totalAmount.
    // (cart items carry the Food document's own _id through as `_id`, since
    // CartContext stores the full Food object plus quantity.)
    const foodIds = items.map(item => item._id || item.foodId);
    const foods = await Food.find({ _id: { $in: foodIds } });

    if (foods.length !== items.length) {
      return res.status(400).json({ msg: "One or more items in this order no longer exist" });
    }

    let recomputedTotal = 0;
    const verifiedItems = items.map(item => {
      const food = foods.find(f => f._id.toString() === String(item._id || item.foodId));

      if (!food.available) {
        throw new Error(`"${food.name}" is currently unavailable`);
      }

      const quantity = Number(item.quantity) || 1;
      recomputedTotal += food.price * quantity;

      // Use the DB's own name/price, not whatever the client sent, so a
      // tampered display value can't end up stored as if it were real.
      return {
        foodId: food._id,
        name: food.name,
        price: food.price,
        quantity
      };
    });

    // 3) Fetch the ACTUAL order from Razorpay's servers and confirm the
    // amount paid matches the recomputed total — not the client's claimed
    // totalAmount. Without this, a client could tamper with the amount
    // sent to /payment/create, pay far less than the real cart total, and
    // still get a full-price order recorded as "Paid".
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const amountActuallyPaidInRupees = razorpayOrder.amount / 100;

    if (amountActuallyPaidInRupees !== recomputedTotal) {
      console.log(
        `Amount mismatch: paid ₹${amountActuallyPaidInRupees}, real cart total ₹${recomputedTotal}`
      );
      return res.status(400).json({ msg: "Payment amount mismatch" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const order = await Order.create({
      userId: req.user.id, 
      items: verifiedItems,
      totalAmount: recomputedTotal,
      status: "Paid",
      otp,
      otpVerified: false
    });

    res.json({ success: true, order });

  } catch (err) {
    console.log("Verify payment error:", err.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
};