const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

connectDB();

// If deployed behind a reverse proxy (Render, Railway, Vercel, etc.),
// this makes req.ip resolve to the real client IP instead of the proxy's —
// needed for express-rate-limit (used in authRoutes.js) to work correctly
// once this is live rather than just local.
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/order', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    msg: err.message || "Something went wrong"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running 🚀 on port ${PORT}`));