

import { motion } from "framer-motion";

function AnimatedCross({ size = 90, color = "#b94a3b" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <motion.circle
        cx="50" cy="50" r="44"
        fill="none" stroke={color} strokeWidth="6"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <motion.path
        d="M35 35 L65 65"
        fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.55 }}
      />
      <motion.path
        d="M65 35 L35 65"
        fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.75 }}
      />
    </svg>
  );
}

export default AnimatedCross;