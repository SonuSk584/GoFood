import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Confetti canvas component ──────────────────────────────────────
const CONF_COLORS = ["#6F4E37","#D4A373","#EDE0D4","#F4A623","#2D6A4F","#A0522D","#ffffff"];

function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let rafId;
    let particles = [];
    let active = true;

    function resize() {
      canvas.width  = canvas.parentElement.offsetWidth  || 600;
      canvas.height = canvas.parentElement.offsetHeight || 600;
    }
    resize();
    window.addEventListener("resize", resize);

    function make() {
      return {
        x:     Math.random() * canvas.width,
        y:     -10,
        r:     4 + Math.random() * 5,
        color: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
        vx:    (Math.random() - 0.5) * 3,
        vy:    2 + Math.random() * 3,
        rot:   Math.random() * 360,
        rotV:  (Math.random() - 0.5) * 6,
        rect:  Math.random() < 0.5,
        alpha: 1,
      };
    }

    // initial burst
    setTimeout(() => {
      for (let i = 0; i < 90; i++) {
        const p = make();
        p.y = Math.random() * (canvas.height * 0.45);
        particles.push(p);
      }
    }, 350);

    // trickle
    const trickle = setInterval(() => {
      if (active) for (let i = 0; i < 4; i++) particles.push(make());
    }, 160);
    setTimeout(() => { active = false; clearInterval(trickle); }, 4500);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0.01);
      particles.forEach(p => {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.06;
        p.rot += p.rotV;
        if (p.y > canvas.height * 0.7) p.alpha -= 0.022;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.rect) ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
        else { ctx.beginPath(); ctx.arc(0, 0, p.r * 0.6, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(trickle);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ── Main page ──────────────────────────────────────────────────────
const FLOATERS = ["🍔","🍕","🌮","🍜","🍩","🧋"];

function OrderPlaced() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const order     = location.state?.order || {};      // pass order from checkout

  const orderId     = order._id     ? `#GF-${order._id.slice(-5).toUpperCase()}` : "#GF-20845";
  const totalAmount = order.totalAmount || 557;
  const items       = order.items || [];
  const itemsLabel  = items.length
    ? items.map(i => `${i.name} × ${i.quantity}`).join(", ")
    : "Classic Burger × 1, Bubble Tea × 2";

  const [activeDot, setActiveDot] = useState(0);

  // Progress dots in sync with bike animation
  useEffect(() => {
    const timings = [0, 1400, 2600, 3500];
    const timers  = timings.map((t, i) =>
      setTimeout(() => setActiveDot(i + 1), t + 900)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const steps = ["Confirmed", "Preparing", "On the way", "Delivered"];

  return (
    <>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.4) rotate(-15deg); opacity: 0; }
          70%  { transform: scale(1.12) rotate(4deg);  opacity: 1; }
          to   { transform: scale(1)   rotate(0deg);   opacity: 1; }
        }
        @keyframes ringPulse {
          0%   { opacity: 0.8; transform: scale(1);   }
          100% { opacity: 0;   transform: scale(1.65); }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes bikeRoll {
          0%   { left: -30px; }
          100% { left: calc(100% - 28px); }
        }
        @keyframes roadFill {
          to { width: 100%; }
        }
        @keyframes blink {
          0%,100% { opacity: 1;   }
          50%     { opacity: 0.3; }
        }
        @keyframes foodFloat {
          0%   { transform: translateY(60px) rotate(0deg);  opacity: 0; }
          10%  { opacity: 0.08; }
          90%  { opacity: 0.08; }
          100% { transform: translateY(-600px) rotate(25deg); opacity: 0; }
        }
        .op-check-ring::before {
          content: '';
          position: absolute; inset: -6px;
          border-radius: 50%;
          border: 3px solid #D4A373;
          animation: ringPulse 1.8s ease-out 0.5s infinite;
          opacity: 0;
        }
        .op-check-path {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: drawCheck 0.5s ease 0.35s forwards;
        }
        .op-bike {
          position: absolute; top: 2px; font-size: 22px; line-height: 1;
          animation: bikeRoll 3.5s cubic-bezier(0.4,0,0.2,1) 0.9s forwards;
          left: -30px;
        }
        .op-road-fill {
          height: 100%; background: #6F4E37; border-radius: 2px;
          width: 0%;
          animation: roadFill 3.5s cubic-bezier(0.4,0,0.2,1) 0.9s forwards;
        }
        .op-btn { transition: background 0.2s, transform 0.15s; }
        .op-btn:active { transform: scale(0.97); }
        .op-btn:hover  { filter: brightness(0.93); }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#F5F5DC",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "sans-serif", color: "#3E3E3E",
        position: "relative", overflow: "hidden"
      }}>

        {/* Confetti */}
        <Confetti />

        {/* Floating food bg */}
        {FLOATERS.map((e, i) => (
          <span key={i} style={{
            position: "absolute",
            left: `${4 + i * 16}%`,
            bottom: 0,
            fontSize: 20,
            pointerEvents: "none",
            userSelect: "none",
            opacity: 0,
            zIndex: 0,
            animation: `foodFloat ${7 + i * 0.9}s linear ${i * 1.1}s infinite`,
          }}>{e}</span>
        ))}

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "32px 20px 28px", width: "100%"
        }}>

          {/* ── Checkmark circle ── */}
          <motion.div
            className="op-check-ring"
            style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "#6F4E37",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20, position: "relative",
              animation: "popIn 0.5s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                className="op-check-path"
                d="M8 21 L17 30 L33 13"
                stroke="#fff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.45 }}
            style={{ fontSize: 22, fontWeight: 500, color: "#6F4E37", marginBottom: 6, textAlign: "center" }}
          >
            Order placed!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.45 }}
            style={{ fontSize: 13, color: "#9b8574", marginBottom: 22, textAlign: "center" }}
          >
            Your food is being prepared 👨‍🍳
          </motion.p>

          {/* ── Delivery tracker ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.45 }}
            style={{
              background: "#fff", borderRadius: 20, border: "1px solid #EDE0D4",
              padding: "18px 20px 16px", width: "100%", maxWidth: 380, marginBottom: 14
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 500, color: "#9b8574", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
              Live delivery
            </div>

            {/* Road */}
            <div style={{ position: "relative", height: 38, marginBottom: 10 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 20, height: 4, background: "#EDE0D4", borderRadius: 2 }}>
                <div className="op-road-fill" />
              </div>
              {/* Dashes overlay */}
              <div style={{
                position: "absolute", left: 0, right: 0, top: 20, height: 4, borderRadius: 2,
                background: "repeating-linear-gradient(to right, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 8px, transparent 8px, transparent 18px)",
                pointerEvents: "none"
              }} />
              <div className="op-bike">🛵</div>
            </div>

            {/* Step dots */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {steps.map((label, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: activeDot > i ? "#6F4E37" : "#EDE0D4",
                    transition: "background 0.4s ease"
                  }} />
                  <span style={{ fontSize: 10, color: "#9b8574" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Order details ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.45 }}
            style={{
              background: "#fff", borderRadius: 18, border: "1px solid #EDE0D4",
              padding: "16px 18px", width: "100%", maxWidth: 380, marginBottom: 16
            }}
          >
            {[
              { label: "Order ID",   val: orderId,     accent: false },
              { label: "Items",      val: itemsLabel,  accent: false },
              { label: "Total paid", val: `₹${totalAmount}`, accent: true },
            ].map(({ label, val, accent }, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 0",
                borderBottom: i < 2 ? "1px solid #f5ede3" : "none",
                fontSize: 13, gap: 10
              }}>
                <span style={{ color: "#9b8574", flexShrink: 0 }}>{label}</span>
                <span style={{ fontWeight: 500, color: accent ? "#6F4E37" : "#3E3E3E", textAlign: "right" }}>{val}</span>
              </div>
            ))}

            {/* ETA */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "7px 0", fontSize: 13
            }}>
              <span style={{ color: "#9b8574" }}>ETA</span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "#FFF3CD", color: "#856404",
                fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#F4A623",
                  animation: "blink 1s ease infinite", display: "inline-block"
                }} />
                25 – 30 min
              </span>
            </div>
          </motion.div>

          {/* ── Actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.45 }}
            style={{ display: "flex", gap: 10, width: "100%", maxWidth: 380 }}
          >
            <button
              className="op-btn"
              onClick={() => navigate("/orders")}
              style={{
                flex: 1, padding: 12, borderRadius: 12, border: "none",
                fontSize: 14, fontWeight: 500, cursor: "pointer",
                background: "#6F4E37", color: "#fff"
              }}
            >
              Track order
            </button>
            <button
              className="op-btn"
              onClick={() => navigate("/home")}
              style={{
                flex: 1, padding: 12, borderRadius: 12, border: "none",
                fontSize: 14, fontWeight: 500, cursor: "pointer",
                background: "#EDE0D4", color: "#6F4E37"
              }}
            >
              Back to menu
            </button>
          </motion.div>

        </div>
      </div>
    </>
  );
}

export default OrderPlaced;