// src/components/motion/PulseBadge.jsx
//
// A gradient badge (icon or initial letter) with a soft pulsing ring
// around it. Used for the header icon on OrderDetails and Orders, and
// (as a circle) for Profile's avatar.
//
// Usage:
//   <PulseBadge size={54} borderRadius={15} accentColor={palette.accent}
//     background={`linear-gradient(135deg, ${palette.primary} 40%, ${palette.accent})`}>
//     📦
//   </PulseBadge>

import { motion } from "framer-motion";

function PulseBadge({
  children,
  size = 54,
  borderRadius = 15,
  background,
  accentColor,
  secondaryColor,
  ringInset = -4,
  hoverAnimate,
  hoverTransition = { duration: 0.5 },
  fontSize = "1.55rem",
  style,
}) {
  return (
    <motion.div
      whileHover={hoverAnimate}
      transition={hoverAnimate ? hoverTransition : undefined}
      style={{
        width: size,
        height: size,
        background,
        borderRadius,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        boxShadow: `0 4px 18px rgba(111,78,55,0.22), 0 0 0 3px ${secondaryColor}`,
        position: "relative",
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{
          position: "absolute",
          inset: `${ringInset}px`,
          borderRadius: borderRadius + 3,
          border: `2px solid ${accentColor}`,
        }}
      />
    </motion.div>
  );
}

export default PulseBadge;