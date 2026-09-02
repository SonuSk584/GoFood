const express = require("express");
const router = express.Router();

const { updateUser } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// ✅ UPDATE NAME
router.put("/update", auth, updateUser);

// ✅ ADD ADDRESS
router.post("/address", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  user.addresses.push(req.body);
  await user.save();

  res.json(user);
});

// ✅ 🔥 FIXED LOCATION ROUTE (OUTSIDE)
router.put("/update-location", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.location = req.body.location;

    await user.save();

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error updating location" });
  }
});

module.exports = router;