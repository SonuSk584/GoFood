// src/components/motion/DecorativeRings.jsx
//
// The two large, slowly-rotating dashed rings in the page background.
// Was defined identically (same sizes, durations, colors sourced from
// palette) in both Cart.jsx and OrderDetails.jsx.
//
// Usage: <DecorativeRings primaryColor={palette.primary} accentColor={palette.accent} />

import { motion } from "framer-motion";

function DecorativeRings({ accentColor, primaryColor }) {
  return (
    <>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", top: "-120px", right: "-120px",
          width: "420px", height: "420px", borderRadius: "50%",
          border: `2px dashed ${accentColor}`, opacity: 0.15, pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", bottom: "-80px", left: "-80px",
          width: "300px", height: "300px", borderRadius: "50%",
          border: `2px dashed ${primaryColor}`, opacity: 0.1, pointerEvents: "none",
        }}
      />
    </>
  );
}

export default DecorativeRings;