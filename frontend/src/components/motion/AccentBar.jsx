// src/components/motion/AccentBar.jsx
//
// The thin gradient bar that draws itself in (scaleX 0 → 1) across the top
// of the frosted card on Cart.jsx and OrderDetails.jsx.
//
// Usage: <AccentBar accentColor={palette.accent} primaryColor={palette.primary} delay={0.2} />

import { motion } from "framer-motion";

function AccentBar({ accentColor, primaryColor, delay = 0.2, duration = 0.7 }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration, delay }}
      style={{
        position: "absolute", top: 0, left: "10%", width: "80%", height: "3px",
        background: `linear-gradient(90deg, transparent, ${accentColor}, ${primaryColor}, ${accentColor}, transparent)`,
        borderRadius: "0 0 4px 4px",
      }}
    />
  );
}

export default AccentBar;