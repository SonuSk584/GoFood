import { useState, useContext } from "react";
import client from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/Authcontext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import LocationPicker from "../components/LocationPicker";
import FoodBackground from "../components/FoodBackground";
import FadeInSection from "../components/motion/FadeInSection";
import { makeCardEntrance } from "../animations/variants";

// Signup's card rises less than the other pages' cards (40px vs 50px) —
// see makeCardEntrance in variants.js.
const cardEntrance = makeCardEntrance({ y: 40 });

function Signup() {
  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();

  const [location, setLocation] = useState(null);
  const [form, setForm]         = useState({ name: "", email: "", password: "" });
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.name || !form.email || !form.password) return setError("All fields are required ❌");
    if (!validateEmail(form.email))                  return setError("Please enter a valid email address 📧");
    if (!location?.lat || !location?.lng)            return setError("Please select your location 📍");
    try {
      setLoading(true);
      const res = await client.post("/auth/signup", { ...form, location });
      setSuccess(res.data.msg || "Check your email to verify 📧") + 
      ("Note: if you don't see it in your inbox, check your spam folder");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await client.post("/auth/google-login", {
        credential: credentialResponse.credential,
      });
      login(res.data);
      navigate("/home");
    } catch {
      setError("Google signup failed ❌");
    }
  };

  return (
    <>
      {/* ── ALL STYLES SCOPED UNDER #sg-root to beat Tailwind specificity ──
          @keyframes (sgShimmer / sgIconDrop / sgShake) now live in
          src/styles/keyframes.css, imported once at the app root. */}
      <style>{`
        #sg-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-family: sans-serif;
          color: #3E3E3E;
          padding: 32px 16px;
        }

        /* Card */
        #sg-card {
          background: rgba(255, 255, 255, 0.94) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border-radius: 24px !important;
          border: 1px solid #EDE0D4 !important;
          padding: 32px 28px 28px !important;
          width: 100% !important;
          max-width: 400px !important;
          position: relative !important;
          z-index: 10 !important;
          box-shadow: 0 24px 60px rgba(111,78,55,0.16) !important;
        }

        /* Shimmer top bar */
        #sg-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(to right, #6F4E37, #D4A373, #6F4E37);
          background-size: 200% 100%;
          border-radius: 24px 24px 0 0;
          animation: sgShimmer 2.5s linear infinite;
        }

        /* Logo */
        .sg-logo-icon {
          font-size: 40px;
          display: block;
          animation: sgIconDrop 0.5s 0.3s cubic-bezier(0.36,0.07,0.19,0.97) both;
        }

        /* Inputs — use !important to override Tailwind border/bg */
        .sg-input {
          width: 100% !important;
          padding: 11px 14px 11px 40px !important;
          border: 1.5px solid #EDE0D4 !important;
          border-radius: 12px !important;
          font-size: 13px !important;
          color: #3E3E3E !important;
          background: #FAFAF5 !important;
          outline: none !important;
          box-shadow: none !important;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s !important;
          box-sizing: border-box !important;
        }
        .sg-input:focus {
          border-color: #D4A373 !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(212,163,115,0.18) !important;
        }
        .sg-input::placeholder { color: #b8a898 !important; }
        .sg-input.sg-invalid   { border-color: #f5a6a6 !important; }

        /* Alerts */
        .sg-error {
          background: #FFF0F0 !important;
          border: 1px solid #f5c6c6 !important;
          color: #C0392B !important;
          font-size: 12px !important;
          text-align: center !important;
          padding: 8px 12px !important;
          border-radius: 10px !important;
          margin-bottom: 12px !important;
          animation: sgShake 0.35s ease !important;
        }
        .sg-success {
          background: #D8F3DC !important;
          border: 1px solid #95D5A8 !important;
          color: #2D6A4F !important;
          font-size: 12px !important;
          text-align: center !important;
          padding: 8px 12px !important;
          border-radius: 10px !important;
          margin-bottom: 12px !important;
        }

        /* Submit button */
        .sg-btn {
          width: 100% !important;
          padding: 12px !important;
          background: #6F4E37 !important;
          color: #fff !important;
          border: none !important;
          border-radius: 12px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          margin-top: 14px !important;
          transition: background 0.2s, transform 0.15s !important;
          box-shadow: none !important;
        }
        .sg-btn:hover:not(:disabled) { background: #5A3D28 !important; transform: translateY(-1px) !important; }
        .sg-btn:active  { transform: scale(0.97) !important; }
        .sg-btn:disabled { opacity: 0.55 !important; cursor: not-allowed !important; }

        /* Location picker wrapper — override its inner buttons */
        #sg-location-wrap button {
          background: #6F4E37 !important;
          color: #fff !important;
          border: none !important;
          border-radius: 10px !important;
          padding: 8px 14px !important;
          font-size: 13px !important;
          cursor: pointer !important;
        }
        #sg-location-wrap button:hover { background: #5A3D28 !important; }
        #sg-location-wrap input {
          border: 1.5px solid #EDE0D4 !important;
          border-radius: 10px !important;
          padding: 9px 12px !important;
          font-size: 13px !important;
          outline: none !important;
          background: #FAFAF5 !important;
        }
        #sg-location-wrap input:focus {
          border-color: #D4A373 !important;
          box-shadow: 0 0 0 3px rgba(212,163,115,0.18) !important;
        }

        /* Divider */
        .sg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 16px 0 12px;
        }
        .sg-divider-line { flex: 1; height: 1px; background: #EDE0D4; }
        .sg-divider-text { font-size: 11px; color: #b8a898; white-space: nowrap; }

        /* Link */
        .sg-link {
          color: #6F4E37 !important;
          font-weight: 500 !important;
          text-decoration: none !important;
          border-bottom: 1.5px solid #D4A373 !important;
          padding-bottom: 1px !important;
          transition: color 0.15s !important;
        }
        .sg-link:hover { color: #D4A373 !important; }

        /* Vignette overlay */
        #sg-vignette {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(245,245,220,0.6) 100%);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {/* Food rising background — covers full screen via position:fixed on emojis */}
      <FoodBackground>

        <div id="sg-root">
          <div id="sg-vignette" />

          {/* Card */}
          <motion.div
            id="sg-card"
            variants={cardEntrance}
            initial="hidden"
            animate="show"
          >
            <div id="sg-topbar" />

            {/* Logo */}
            <FadeInSection delay={0.1} style={{ textAlign: "center", marginBottom: 4 }}>
              <span className="sg-logo-icon">🍔</span>
              <span style={{ fontSize: 20, fontWeight: 500, color: "#6F4E37" }}>GoFood</span>
            </FadeInSection>

            <FadeInSection delay={0.2} y={8}>
              <p style={{ fontSize: 13, color: "#9b8574", textAlign: "center", marginBottom: 18 }}>
                Join GoFood and start ordering!
              </p>
            </FadeInSection>

            {/* Error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key={error}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="sg-error"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="sg-success"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

              {/* Name */}
              <FadeInSection delay={0.22} x={-16} y={0} style={{ position: "relative", marginBottom: 11 }}>
                <span style={{
                  position: "absolute", left: 13, top: "50%",
                  transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1
                }}>👤</span>
                <input
                  className="sg-input" type="text" placeholder="Full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </FadeInSection>

              {/* Email */}
              <FadeInSection delay={0.28} x={-16} y={0} style={{ position: "relative", marginBottom: 4 }}>
                <span style={{
                  position: "absolute", left: 13, top: "50%",
                  transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1
                }}>✉️</span>
                <input
                  className={`sg-input${form.email && !validateEmail(form.email) ? " sg-invalid" : ""}`}
                  type="email" placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </FadeInSection>
              {form.email && !validateEmail(form.email) && (
                <p style={{ fontSize: 11, color: "#C0392B", marginBottom: 8, paddingLeft: 4 }}>
                  Invalid email format ❌
                </p>
              )}

              {/* Password */}
              <FadeInSection delay={0.34} x={-16} y={0} style={{ position: "relative", marginBottom: 14 }}>
                <span style={{
                  position: "absolute", left: 13, top: "50%",
                  transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none", zIndex: 1
                }}>🔒</span>
                <input
                  className="sg-input" type="password" placeholder="Password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </FadeInSection>

              {/* Location */}
              <FadeInSection delay={0.38} y={10}>
                <p style={{
                  fontSize: 12, fontWeight: 500, color: "#6F4E37",
                  marginBottom: 8, display: "flex", alignItems: "center", gap: 4
                }}>
                  📍 Select Delivery Location
                </p>
                {/* Wrapper to override LocationPicker's internal button/input styles */}
                <div id="sg-location-wrap">
                  <LocationPicker setLocation={setLocation} />
                </div>
                {location && (
                  <p style={{ fontSize: 12, color: "#2D6A4F", marginTop: 6 }}>
                    ✅ {location.address || "Location selected"}
                  </p>
                )}
              </FadeInSection>

              {/* Submit */}
              <motion.button
                className="sg-btn"
                type="submit"
                disabled={loading || Boolean(form.email && !validateEmail(form.email))}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </motion.button>

            </form>

            {/* Divider */}
            <motion.div
              className="sg-divider"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.48 }}
            >
              <div className="sg-divider-line" />
              <span className="sg-divider-text">or continue with</span>
              <div className="sg-divider-line" />
            </motion.div>

            {/* Google */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google login failed ❌")}
              />
            </motion.div>

            {/* Login link */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.52 }}
              style={{ textAlign: "center", fontSize: 12, color: "#9b8574", marginTop: 14 }}
            >
              Already have an account?{" "}
              <Link to="/" className="sg-link">Login</Link>
            </motion.p>

          </motion.div>
        </div>

      </FoodBackground>
    </>
  );
}

export default Signup;