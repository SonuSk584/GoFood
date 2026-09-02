const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  img: String,
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Food", foodSchema);