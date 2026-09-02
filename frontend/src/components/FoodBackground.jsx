import { useEffect, useRef } from "react";

const FOODS = [
  "🍕","🍔","🌮","🍜","🍣","🍩","🥗","🍛","🌯","🥪",
  "🍱","🥩","🍤","🧆","🥟","🍝","🥘","🫕","🍗","🥙",
  "🍦","🧁","🍰","🥐","🥞","🍙","🫔","🥗","🍠","🫓",
];

function FoodBackground({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // ── KEY FIX: spawn emojis on document.body with position:fixed
    // so they are NEVER clipped by the parent overflow:hidden ──
    function spawnFood() {
      const el       = document.createElement("div");
      const emoji    = FOODS[Math.floor(Math.random() * FOODS.length)];
      const size     = 22 + Math.random() * 22;
      const left     = 3 + Math.random() * 91;
      const duration = 5 + Math.random() * 7;
      const delay    = Math.random() * 1.5;

      el.textContent  = emoji;
      el.style.cssText = `
        position: fixed;
        bottom: -44px;
        left: ${left}%;
        font-size: ${size}px;
        opacity: 0;
        pointer-events: none;
        user-select: none;
        filter: drop-shadow(0 2px 6px rgba(111,78,55,0.15));
        animation: foodRise ${duration}s ${delay}s linear forwards;
        z-index: 0;
      `;

      document.body.appendChild(el);
      setTimeout(
        () => el.remove(),
        (duration + delay + 0.6) * 1000
      );
    }

    // Inject keyframes once
    if (!document.getElementById("food-keyframes")) {
      const style     = document.createElement("style");
      style.id        = "food-keyframes";
      style.textContent = `
        @keyframes foodRise {
          0%   { transform: translateY(0) rotate(0deg) scale(0.65); opacity: 0; }
          8%   { opacity: 0.82; }
          88%  { opacity: 0.65; }
          100% { transform: translateY(-105vh) rotate(28deg) scale(1.1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Burst on mount
    for (let i = 0; i < 16; i++) {
      setTimeout(spawnFood, i * 180);
    }

    const interval = setInterval(spawnFood, 340);

    // Cleanup: remove interval AND all emojis this instance spawned
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 25% 15%, #EDE0D4 0%, #F5F5DC 55%, #e8e4c9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        // ── overflow: visible so nothing clips the fixed-position emojis ──
        overflow: "visible",
        padding: "32px 16px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      {/* Rotating decorative rings */}
      <div style={{
        position: "absolute", top: "-130px", right: "-130px",
        width: "440px", height: "440px", borderRadius: "50%",
        border: "2px dashed #D4A373", opacity: 0.16, pointerEvents: "none",
        animation: "spinRing 70s linear infinite",
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute", bottom: "-90px", left: "-90px",
        width: "320px", height: "320px", borderRadius: "50%",
        border: "2px dashed #6F4E37", opacity: 0.11, pointerEvents: "none",
        animation: "spinRing 90s linear infinite reverse",
        zIndex: 0,
      }} />

      <style>{`
        @keyframes spinRing { to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap');
      `}</style>

      {/* Page content sits on top */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

export default FoodBackground;