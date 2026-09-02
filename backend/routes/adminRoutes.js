const express = require("express");
const router = express.Router();
const { addFood,getFoods,deleteFood,getOrders,updateOrder,updateFood } = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload"); // ✅ ADD THIS
const { toggleStock } = require("../controllers/adminController");

router.post(
  "/add-food",
  auth,
  admin,
  upload.single("image"), // 🔥 THIS FIXES EVERYTHING
  addFood
);

router.get("/foods", auth, admin, getFoods);

router.delete("/food/:id", auth, admin, deleteFood);

router.get("/orders", auth, admin, getOrders);
router.put("/order/:id", auth, admin, updateOrder);

router.put("/food/:id", auth, admin, updateFood);
router.put("/toggle-stock/:id", auth, admin, toggleStock);

module.exports = router;