import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * GoFood Animated Logo
 * Props:
 *   size   — "sm" | "md" | "lg"  (default: "md")
 *   showTagline — boolean (default: false)
 */
function GoFoodLogo({ size = "md", showTagline = false }) {
  const orbitRef = useRef(null);
  const rafRef = useRef(null);

  const scale = { sm: 0.6, md: 1, lg: 1.35 }[size] || 1;

  useEffect(() => {
    const container = orbitRef.current;
    if (!container) return;
    const dots = container.querySelectorAll(".orbit-dot");
    let angles = [0, 120, 240];
    const radius = 54;

    function tick() {
      angles = angles.map(a => (a + 0.55) % 360);
      dots.forEach((dot, i) => {
        const rad = (angles[i] * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        dot.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 0,
      transform: `scale(${scale})`,
      transformOrigin: "center top",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Cormorant+Garamond:wght@600&display=swap');
        @keyframes gf-spinRing  { to { transform: rotate(360deg); } }
        @keyframes gf-pulse     { 0%,100%{box-shadow:0 4px 24px rgba(111,78,55,.35);transform:scale(1)}50%{box-shadow:0 6px 36px rgba(212,163,115,.5);transform:scale(1.05)} }
        @keyframes gf-bounce    { 0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-4px) rotate(4deg)} }
        @keyframes gf-steam     { 0%{transform:translateY(0) scaleX(1);opacity:.7}50%{transform:translateY(-8px) scaleX(1.4);opacity:.4}100%{transform:translateY(-16px) scaleX(.8);opacity:0} }
        @keyframes gf-dotPop    { 0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.6);opacity:1} }
        @keyframes gf-underline { from{width:0%;opacity:0}to{width:100%;opacity:1} }
        @keyframes gf-letter    { 0%,100%{letter-spacing:.28em;opacity:.85}50%{letter-spacing:.38em;opacity:1} }
      `}</style>

      {/* Steam wisps */}
      <div style={{ display: "flex", gap: "7px", marginBottom: "4px" }}>
        {[18, 26, 18].map((h, i) => (
          <div key={i} style={{
            width: "3px", height: `${h}px`, borderRadius: "2px",
            background: "linear-gradient(to top, #D4A373, transparent)",
            animation: `gf-steam 1.8s ease-in-out ${i * 0.25}s infinite`,
          }} />
        ))}
      </div>

      {/* Icon ring */}
      <div ref={orbitRef} style={{ position: "relative", width: "110px", height: "110px", marginBottom: "16px" }}>
        {/* Outer dashed ring */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2px dashed #D4A373", opacity: 0.55,
          animation: "gf-spinRing 10s linear infinite",
        }} />
        {/* Inner dashed ring */}
        <div style={{
          position: "absolute", inset: "12px", borderRadius: "50%",
          border: "1.5px dashed #6F4E37", opacity: 0.35,
          animation: "gf-spinRing 7s linear infinite reverse",
        }} />
        {/* Core */}
        <div style={{
          position: "absolute", inset: "18px", borderRadius: "50%",
          background: "linear-gradient(135deg, #6F4E37 30%, #D4A373 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "gf-pulse 3s ease-in-out infinite",
        }}>
          <svg width="38" height="38" viewBox="0 0 48 48" fill="none"
            style={{ animation: "gf-bounce 2.8s ease-in-out infinite" }}>
            <ellipse cx="24" cy="32" rx="14" ry="7" fill="#F5F5DC" opacity="0.95"/>
            <path d="M10 32 Q10 20 24 18 Q38 20 38 32" fill="#EDE0D4" stroke="#D4A373" strokeWidth="1.5"/>
            <path d="M18 18 Q18 10 24 9 Q30 10 30 18" fill="none" stroke="#F5F5DC" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="24" cy="9" r="3" fill="#F5F5DC"/>
            <ellipse cx="24" cy="32" rx="10" ry="4.5" fill="#D4A373" opacity="0.4"/>
          </svg>
        </div>

        {/* Orbiting dots */}
        {[
          { size: 9, bg: "#D4A373", border: "none" },
          { size: 6, bg: "#6F4E37", border: "none" },
          { size: 7, bg: "#EDE0D4", border: "1.5px solid #D4A373" },
        ].map((d, i) => (
          <div key={i} className="orbit-dot" style={{
            position: "absolute",
            width: `${d.size}px`, height: `${d.size}px`,
            borderRadius: "50%",
            background: d.bg,
            border: d.border,
            top: "50%", left: "50%",
            pointerEvents: "none",
          }} />
        ))}
      </div>

      {/* Text group */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}
      >
        {/* "Go" label */}
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 600, fontSize: "22px",
          letterSpacing: "0.28em", color: "#D4A373",
          textTransform: "uppercase",
          animation: "gf-letter 3.5s ease-in-out infinite",
        }}>
          — Go —
        </span>

        {/* "Food" wordmark */}
        <div style={{ position: "relative" }}>
          <motion.span
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "block",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700, fontSize: "58px",
              color: "#6F4E37", lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            Food
          </motion.span>
          {/* Animated underline */}
          <div style={{
            height: "3px", borderRadius: "2px", marginTop: "4px",
            background: "linear-gradient(90deg, transparent, #D4A373, #6F4E37, #D4A373, transparent)",
            width: 0, opacity: 0,
            animation: "gf-underline 0.9s cubic-bezier(0.22,1,0.36,1) 1.1s forwards",
          }} />
        </div>

        {/* Tagline */}
        {showTagline && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "12px", fontWeight: 600,
              letterSpacing: "0.22em", color: "#9a7a60",
              textTransform: "uppercase", marginTop: "8px",
            }}
          >
            Your Taste · Our Craft
          </motion.span>
        )}
      </motion.div>

      {/* Decorative dots */}
      <div style={{ display: "flex", gap: "5px", marginTop: "12px" }}>
        {[
          { bg: "#D4A373", delay: "0s" },
          { bg: "#6F4E37", delay: "0.22s" },
          { bg: "#D4A373", delay: "0.44s" },
        ].map((d, i) => (
          <div key={i} style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: d.bg,
            animation: `gf-dotPop 1.8s ease-in-out ${d.delay} infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default GoFoodLogo;