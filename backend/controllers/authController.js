const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 📧 EMAIL — sent via Brevo's HTTP API instead of SMTP.
// Render's free tier blocks outbound SMTP ports (25/465/587) as of
// Sept 2025 to prevent spam abuse, which is why nodemailer + Gmail SMTP
// worked locally but timed out (ETIMEDOUT) in production. Brevo's API
// runs over plain HTTPS (port 443), which isn't blocked.
async function sendVerificationEmail(to, verifyLink) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: process.env.EMAIL, name: "GoFood" },
      to: [{ email: to }],
      subject: "Verify your GoFood account",
      htmlContent: `<h3>Click below to verify your account:</h3>
                    <a href="${verifyLink}">${verifyLink}</a>`,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Brevo send failed: ${res.status} ${errBody}`);
  }
}


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

    const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify/${verifyToken}`;

    await sendVerificationEmail(email, verifyLink);

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

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ msg: "Invalid credentials ❌" });

    if (!user.isVerified) {
      return res.status(400).json({ msg: "Please verify your email first 📧" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials ❌" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // Explicitly fetched password for the compare() above — strip it
    // before sending the user back to the client.
    user.password = undefined;

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

    // User.create() returns the freshly-created document, which still
    // includes the "google_oauth" placeholder value (select:false only
    // filters query results, not documents you just created) — strip it
    // before responding, same as login.
    user.password = undefined;

    res.json({ token, user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Google login failed ❌" });
  }
};