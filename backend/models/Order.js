const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      // Links each order line back to the actual Food document, so the
      // server can look up its real current price instead of trusting
      // whatever price the client sent. Optional (not `required`) so this
      // doesn't break Orders already saved without it.
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food"
      },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: "Pending"
  },
  otp: {
    type: String
  },
  otpVerified: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

// userId is queried on every "My Orders" page load — index keeps that fast
orderSchema.index({ userId: 1 });

module.exports = mongoose.model("Order", orderSchema);