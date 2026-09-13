import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import client from "../api/client";
import DecorativeRings from "../components/motion/DecorativeRings";
import AccentBar from "../components/motion/AccentBar";
import Watermark from "../components/motion/Watermark";
import AnimatedCheckmark from "../componentts/motion/AnimatedCheckmark";
import AnimatedCross from "../components/motion/AnimatedCross";
import { cardEntrance, fade } from "../animations/variants";

const palette = {
  primary: "#6F4E37",
  background: "#F5F5DC",
  secondary: "#EDE0D4",
  text: "#3E3E3E",
  accent: "#D4A373",
};

const buttonStyle = {
  display: "inline-block",
  marginTop: "22px",
  padding: "12px 28px",
  borderRadius: "12px",
  background: `linear-gradient(135deg, ${palette.primary} 60%, #8B6347)`,
  color: "#F5F5DC",
  fontFamily: "'Playfair Display', Georgia, serif",
  fontWeight: 600,
  fontSize: "0.95rem",
  letterSpacing: "0.05em",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
};

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    client.get(`/auth/verify/${token}`)
      .then(res => {
        setStatus("success");
        setMessage(res.data.msg || "Your email has been verified.");
      })
      .catch(err => {
        setStatus("error");
        setMessage(err.response?.data?.msg || "This link is invalid or has expired.");
      });
  }, [token]);

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 25% 15%, #EDE0D4 0%, #F5F5DC 55%, #e8e4c9 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "48px 16px",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      position: "relative", overflow: "hidden",
    }}>

      <DecorativeRings accentColor={palette.accent} primaryColor={palette.primary} />

      <motion.div
        variants={cardEntrance}
        initial="hidden"
        animate="show"
        style={{
          background: "rgba(255,252,245,0.93)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: `0 8px 48px rgba(111,78,55,0.14), 0 1.5px 0 ${palette.accent} inset`,
          borderRadius: "24px",
          padding: "44px 36px 36px",
          width: "100%", maxWidth: "440px",
          textAlign: "center",
          position: "relative",
          border: `1px solid rgba(212,163,115,0.25)`,
        }}
      >
        <AccentBar accentColor={palette.accent} primaryColor={palette.primary} delay={0.2} />

        {status === "loading" && (
          <motion.div variants={fade} initial="hidden" animate="show" style={{ padding: "24px 0" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 64, height: 64, margin: "0 auto 24px",
                borderRadius: "50%",
                border: `4px solid ${palette.secondary}`,
                borderTopColor: palette.primary,
              }}
            />
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", fontWeight: 700, color: palette.primary, margin: 0 }}>
              Verifying your email…
            </h2>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div variants={fade} initial="hidden" animate="show" style={{ padding: "8px 0" }}>
            <AnimatedCheckmark />
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", fontWeight: 700, color: palette.primary, margin: "18px 0 8px" }}>
              Email Verified! 🎉
            </h2>
            <p style={{ color: palette.text, fontSize: "1rem", margin: 0 }}>
              {message}
            </p>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={buttonStyle}
              >
                Go to Login →
              </motion.button>
            </Link>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div variants={fade} initial="hidden" animate="show" style={{ padding: "8px 0" }}>
            <AnimatedCross />
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", fontWeight: 700, color: "#b94a3b", margin: "18px 0 8px" }}>
              Verification Failed
            </h2>
            <p style={{ color: palette.text, fontSize: "1rem", margin: 0 }}>
              {message}
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={buttonStyle}
              >
                Back to Signup
              </motion.button>
            </Link>
          </motion.div>
        )}

        <Watermark primaryColor={palette.primary} delay={0.9} />
      </motion.div>
    </div>
  );
}

export default VerifyEmail;