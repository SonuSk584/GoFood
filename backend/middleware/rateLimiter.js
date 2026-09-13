
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { msg: "Too many attempts. Please try again in a few minutes." },
  standardHeaders: true, 
  legacyHeaders: false,  
});

module.exports = authLimiter;