// src/components/motion/Watermark.jsx
//
// The small fading "☕ Your Taste, Our Craft" footer line at the bottom of
// the frosted card, identical in Cart.jsx and OrderDetails.jsx.
//
// Usage: <Watermark primaryColor={palette.primary} />

import { motion } from "framer-motion";

function Watermark({
  primaryColor,
  text = "☕ Your Taste, Our Craft",
  delay = 1,
  opacity = 0.32,
  fontSize = "0.68rem",
}) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ delay }}
      style={{
        textAlign: "center",
        marginTop: "26px",
        fontSize,
        letterSpacing: "0.18em",
        color: primaryColor,
        fontFamily: "'Playfair Display', Georgia, serif",
        textTransform: "uppercase",
      }}
    >
      {text}
    </motion.p>
  );
}

export default Watermark;