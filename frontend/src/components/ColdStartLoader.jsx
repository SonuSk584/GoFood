// src/components/ColdStartLoader.jsx
//
// Wraps the app. Pings the backend's lightweight /health endpoint on mount;
// while waiting for a response (Render's free tier can take 20-50s to wake
// from cold start), shows an animated "waking up" screen instead of a blank
// page. Once the backend responds, renders the actual app.
//
// Usage (in main.jsx, wrapping <App />):
//   <ColdStartLoader>
//     <App />
//   </ColdStartLoader>

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";
import DecorativeRings from "./motion/DecorativeRings";
import { cardEntrance } from "../animations/variants";

const palette = {
  primary: "#6F4E37",
  secondary: "#EDE0D4",
  accent: "#D4A373",
  text: "#3E3E3E",
};

const messages = [
  "Our server naps when nobody's ordering 😴",
  "Firing up the kitchen for you 🔥",
  "Warming up the grill…",
  "Almost there — thanks for waiting!",
];

function ColdStartLoader({ children }) {
  const [ready, setReady] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      try {
        await client.get("/health");
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setTimeout(ping, 2000);
      }
    };
    ping();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (ready) return;
    const t = setInterval(
      () => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)),
      1000
    );
    return () => clearInterval(t);
  }, [ready]);

  useEffect(() => {
    if (ready) return;
    const t = setInterval(
      () => setMsgIndex(i => (i + 1) % messages.length),
      3200
    );
    return () => clearInterval(t);
  }, [ready]);

  if (ready) return children;

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
          width: "100%", maxWidth: "400px",
          textAlign: "center",
          position: "relative",
          border: `1px solid rgba(212,163,115,0.25)`,
        }}
      >
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: "3.6rem", lineHeight: 1 }}
        >
          🍔
        </motion.div>

        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.4rem", fontWeight: 700,
          color: palette.primary, margin: "20px 0 8px",
        }}>
          Waking up the kitchen…
        </h2>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            style={{ color: palette.text, fontSize: "0.95rem", minHeight: "1.4em", margin: 0 }}
          >
            {messages[msgIndex]}
          </motion.p>
        </AnimatePresence>

        <div style={{
          width: "100%", height: 6, borderRadius: 3,
          background: palette.secondary, overflow: "hidden", marginTop: 20,
        }}>
          <motion.div
            animate={{ x: ["-100%", "260%"] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "40%", height: "100%", borderRadius: 3, background: palette.primary }}
          />
        </div>

        <p style={{ marginTop: 14, fontSize: "0.78rem", color: palette.accent, letterSpacing: "0.03em" }}>
          {elapsed}s elapsed — first load can take up to a minute
        </p>
      </motion.div>
    </div>
  );
}

export default ColdStartLoader;