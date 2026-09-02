const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.post('/place', auth, placeOrder);
router.get('/myorders', auth, getOrders);
router.get("/:id", auth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

module.exports = router;