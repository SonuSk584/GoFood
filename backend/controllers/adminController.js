const Food = require("../models/Food");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.addFood = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // 🔥 Convert buffer → stream
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

  } catch (err) {
    console.log("FULL ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json({ error: err.message });
  }
};
exports.getFoods = async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
};

exports.deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Order = require("../models/Order");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email location") // ✅ only needed fields
      .sort({ createdAt: -1 });         // ✅ latest orders first

    res.json(orders);

  } catch (err) {
    console.log("GET ORDERS ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch orders ❌" });
  }
};

exports.updateOrder = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(order);
};

exports.updateFood = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const updated = await Food.findByIdAndUpdate(
      req.params.id,
      { name, price, category },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.toggleStock = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }

    // 🔥 toggle value
    food.available = !food.available;

    await food.save();

    res.json(food);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};