import { useState, useContext } from "react";
import client from "../api/client";
import { AuthContext } from "../context/Authcontext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { fade } from "../animations/variants";

const floaters = ["🍔", "🍕", "🌮", "🍜", "🧋", "🍣", "🍩"];

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 NORMAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      const res = await client.post("/auth/login", form);

      login(res.data);
      setError("");
      navigate("/home");

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔵 GOOGLE LOGIN
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await client.post("/auth/google-login", {
        credential: credentialResponse.credential
      });

      login(res.data);
      navigate("/home");

    } catch (err) {
      console.log(err);
      setError("Google login failed ❌");
    }
  };

  return (
    <>
      <div style={{
        minHeight: "100vh",
        background: "#F5F5DC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>

        {/* Floating emojis — keyframe now lives in src/styles/keyframes.css */}
        {floaters.map((emoji, i) => (
          <span key={i} style={{
            position: "absolute",
            left: `${8 + i * 13}%`,
            fontSize: 28,
            opacity: 0,
            animation: `floatUp ${7 + i * 0.7}s linear ${i * 1.1}s infinite`
          }}>
            {emoji}
          </span>
        ))}

        {/*
          Login's card entrance is intentionally its own thing: no scale,
          44px rise, and no custom transition (uses Framer's default spring
          for the y offset) — matches the original exactly rather than being
          forced through the shared cardEntrance used by Cart/OrderDetails/etc,
          which adds a scale + custom easing that Login never had.
        */}
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >

          <h2 className="text-3xl font-bold text-center mb-2">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 text-center mb-6">
            Login to GoFood
          </p>

          {/* ERROR */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-500 text-sm mb-3 text-center"
                variants={fade}
                initial="hidden"
                animate="show"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-3 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-4 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* 🔵 GOOGLE LOGIN */}
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed ❌")}
            />
          </div>

          {/* SIGNUP */}
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </p>

        </motion.div>
      </div>
    </>
  );
}

export default Login;