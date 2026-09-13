
import { motion } from "framer-motion";

function AnimatedCheckmark({ size = 90, color = "#2a9b4a" }) {
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
        d="M29 52 L44 67 L73 34"
        fill="none" stroke={color} strokeWidth="7"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
      />
    </svg>
  );
}

export default AnimatedCheckmark;