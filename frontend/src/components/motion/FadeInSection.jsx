// src/components/motion/FadeInSection.jsx
//
// Replaces the repeated block:
//   <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
//               transition={{delay:0.1,duration:0.4}}>...</motion.div>
// that was copy-pasted on Admin, Cart, and Login.
//
// Usage:
//   <FadeInSection delay={0.1}>            // rises up (default)
//   <FadeInSection delay={0.1} x={-16} y={0}>  // slides in from the left

import { motion } from "framer-motion";
import { easeOut } from "../../animations/variants";

function FadeInSection({
  children,
  delay = 0,
  x = 0,
  y = 14,
  duration = 0.4,
  style,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration, ease: easeOut }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default FadeInSection;