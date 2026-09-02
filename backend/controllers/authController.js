const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 📧 EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});


// =======================
// 🔐 SIGNUP (WITH EMAIL VERIFICATION)
// =======================
exports.signup = async (req, res) => {
  let user; // keep a reference so we can roll it back if email sending fails
  try {
    const { name, email, password, location } = req.body;

    const existing = await User.findOne({ email });

    // If a user exists but never got their verification email (previous
    // signup attempt crashed before/during sending), let them retry instead
    // of permanently blocking that email address.
    if (existing && existing.isVerified) {
      return res.status(400).json({ msg: "User already exists" });
    }
    if (existing && !existing.isVerified) {
      await User.deleteOne({ _id: existing._id });
    }

    const hashed = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    user = await User.create({
      name,
      email,
      password: hashed,
      location,
      isVerified: false,
      verifyToken
    });

    const verifyLink = `http://localhost:5000/api/auth/verify/${verifyToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Verify your GoFood account",
      html: `<h3>Click below to verify your account:</h3>
             <a href="${verifyLink}">${verifyLink}</a>`
    });

    res.json({ msg: "Signup successful. Please verify your email 📧" });

  } catch (err) {
    console.log(err);

    // Sending the verification email failed — don't leave an orphaned,
    // permanently-unverifiable user in the database. Roll it back so the
    // person can simply try signing up again once the mail issue is fixed.
    if (user) {
      await User.deleteOne({ _id: user._id }).catch(() => {});
    }

    res.status(500).json({
      msg: "Signup failed while sending the verification email. Please try again."
    });
  }
};


// =======================
// 📧 VERIFY EMAIL
// =======================
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verifyToken: req.params.token });

    if (!user) {
      return res.status(400).send("Invalid or expired token ❌");
    }

    user.isVerified = true;
    user.verifyToken = undefined;

    await user.save();

    res.send("Email verified successfully ✅");

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =======================
// 🔑 LOGIN (ONLY VERIFIED USERS)
// =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials ❌" });

    if (!user.isVerified) {
      return res.status(400).json({ msg: "Please verify your email first 📧" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials ❌" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =======================
// 🔵 GOOGLE LOGIN
// =======================
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google_oauth",
        isVerified: true
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Google login failed ❌" });
  }
};