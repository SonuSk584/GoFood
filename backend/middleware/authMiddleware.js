const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {  // ✅ async added
  let token = req.headers.authorization;

  console.log("HEADER:", token);

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  // ✅ Handle Bearer token
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user; // 🔥 IMPORTANT (now includes role)
    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};