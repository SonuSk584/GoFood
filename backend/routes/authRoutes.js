const express = require('express');
const router = express.Router();
const { signup, login, googleLogin, verifyEmail } = require('../controllers/authController');
const authLimiter = require('../middleware/rateLimiter');

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post("/google-login", authLimiter, googleLogin);
router.get("/verify/:token", verifyEmail); // one-time token link, no limiter needed

module.exports = router;