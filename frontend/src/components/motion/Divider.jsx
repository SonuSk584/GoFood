// src/components/motion/Divider.jsx
//
// Thin horizontal line that draws itself in via scaleX 0→1. Appears 2-3
// times per page on Cart, OrderDetails, Orders, and Profile, always with
// the same gradient shape and just a different delay/margin.
//
// Usage: <Divider accentColor={palette.accent} delay={0.35} style={{marginBottom: 22}} />

import { motion } from "framer-motion";

function Divider({ accentColor, delay = 0, duration = 0.5, style }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay, duration }}
      style={{
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)`,
        ...style,
      }}
    />
  );
}

export default Divider;