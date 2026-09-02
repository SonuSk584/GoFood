// src/components/motion/Skeleton.jsx
//
// One shimmering placeholder bar/block, used while data is loading.
// Replaces the repeated
//   <motion.div animate={{opacity:[0.4,0.8,0.4]}} transition={{duration:1.4,repeat:Infinity,delay:...}}
//               style={{height, borderRadius, background: palette.secondary}} />
// blocks that were copy-pasted 6 times in OrderDetails.jsx's loading state.
//
// Usage:
//   <Skeleton width="60%" height={22} delay={0.1} />

import { motion } from "framer-motion";
import { pulseShimmer } from "../../animations/variants";

function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  background = "#EDE0D4",
  delay = 0,
  style,
}) {
  const { animate, transition } = pulseShimmer(delay);
  return (
    <motion.div
      animate={animate}
      transition={transition}
      style={{ width, height, borderRadius, background, ...style }}
    />
  );
}

export default Skeleton;