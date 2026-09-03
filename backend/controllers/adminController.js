const Food = require("../models/Food");
const Order = require("../models/Order");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const asyncHandler = require("../utils/asyncHandler");

exports.addFood = asyncHandler(async (req, res) => {
  const { name, price, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const streamUpload = () => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "gofood" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  const result = await streamUpload();

  const food = await Food.create({
    name,
    price,
    category,
    img: result.secure_url
  });

  res.json(food);
});

exports.getFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

exports.deleteFood = asyncHandler(async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted successfully" });
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email location")
    .sort({ createdAt: -1 });

  res.json(orders);
});

exports.updateOrder = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ msg: "Order not found" });
  }

  res.json(order);
});

exports.updateFood = asyncHandler(async (req, res) => {
  const { name, price, category } = req.body;

  const updated = await Food.findByIdAndUpdate(
    req.params.id,
    { name, price, category },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ msg: "Food not found" });
  }

  res.json(updated);
});

exports.toggleStock = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    return res.status(404).json({ msg: "Food not found" });
  }

  food.available = !food.available;
  await food.save();

  res.json(food);
});