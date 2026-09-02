// src/components/motion/AnimatedIconButton.jsx
//
// Replaces the whileHover/whileTap block that was copy-pasted 4+ times
// in Cart.jsx (qty +, qty -, remove button, checkout button) with slightly
// different numbers each time.
//
// Usage:
//   <AnimatedIconButton onClick={...} style={{...your box styles}}>
//     −
//   </AnimatedIconButton>

import { motion } from "framer-motion";

function AnimatedIconButton({
  children,
  onClick,
  style,
  hover = { scale: 1.1 },
  tap = { scale: 0.93 },
  title,
  ...rest
}) {
  return (
    <motion.button
      whileHover={hover}
      whileTap={tap}
      onClick={onClick}
      title={title}
      style={{
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export default AnimatedIconButton;