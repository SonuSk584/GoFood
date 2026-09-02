import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import FadeInSection from "../components/motion/FadeInSection";
import DecorativeRings from "../components/motion/DecorativeRings";
import AccentBar from "../components/motion/AccentBar";
import Watermark from "../components/motion/Watermark";
import Skeleton from "../components/motion/Skeleton";
import { fadeUp, cardEntrance } from "../animations/variants";

const palette = {
  primary: "#6F4E37",
  background: "#F5F5DC",
  secondary: "#EDE0D4",
  text: "#3E3E3E",
  accent: "#D4A373",
};

const statusConfig = {
  pending:   { color: "#b97a2a", bg: "rgba(212,163,115,0.18)", border: "rgba(212,163,115,0.4)",  icon: "⏳", label: "Pending" },
  confirmed: { color: "#2a7ab9", bg: "rgba(42,122,185,0.10)",  border: "rgba(42,122,185,0.3)",   icon: "✅", label: "Confirmed" },
  preparing: { color: "#7a4fb9", bg: "rgba(122,79,185,0.10)",  border: "rgba(122,79,185,0.3)",   icon: "👨‍🍳", label: "Preparing" },
  delivered: { color: "#2a9b4a", bg: "rgba(42,155,74,0.10)",   border: "rgba(42,155,74,0.3)",    icon: "🎉", label: "Delivered" },
  cancelled: { color: "#b94a3b", bg: "rgba(185,74,59,0.09)",   border: "rgba(185,74,59,0.28)",   icon: "✕",  label: "Cancelled" },
};

function getStatus(raw = "") {
  const key = raw.toLowerCase();
  return statusConfig[key] || { color: palette.primary, bg: palette.secondary, border: palette.accent, icon: "📦", label: raw };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    client.get(`/order/${id}`)
      .then(res => setOrder(res.data));
  }, []);

  const status = order ? getStatus(order.status) : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 25% 15%, #EDE0D4 0%, #F5F5DC 55%, #e8e4c9 100%)`,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "48px 16px",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      position: "relative", overflow: "hidden",
    }}>

      <DecorativeRings accentColor={palette.accent} primaryColor={palette.primary} />

      <motion.div
        variants={cardEntrance}
        initial="hidden"
        animate="show"
        style={{
          background: "rgba(255,252,245,0.93)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: `0 8px 48px rgba(111,78,55,0.14), 0 1.5px 0 ${palette.accent} inset`,
          borderRadius: "24px",
          padding: "40px 36px 36px",
          width: "100%", maxWidth: "520px",
          position: "relative",
          border: `1px solid rgba(212,163,115,0.25)`,
        }}
      >
        <AccentBar accentColor={palette.accent} primaryColor={palette.primary} delay={0.2} />

        {/* Loading shimmer */}
        <AnimatePresence>
          {!order && (
            <motion.div key="shimmer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
              {/* Header shimmer */}
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "28px" }}>
                <Skeleton width="54px" height={54} borderRadius={15} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="60%" height={22} borderRadius={8} delay={0.1} style={{ marginBottom: 8 }} />
                  <Skeleton width="40%" height={14} borderRadius={6} delay={0.2} />
                </div>
              </div>
              {[1, 2, 3, 4].map(n => (
                <Skeleton key={n} height={52} borderRadius={12} delay={n * 0.12} style={{ marginBottom: 10 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loaded content */}
        <AnimatePresence>
          {order && (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

              {/* Header */}
              <FadeInSection
                delay={0.1}
                duration={0.44}
                style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}
                  style={{
                    width: "54px", height: "54px",
                    background: `linear-gradient(135deg, ${palette.primary} 40%, ${palette.accent})`,
                    borderRadius: "15px", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "1.55rem",
                    boxShadow: `0 4px 18px rgba(111,78,55,0.22), 0 0 0 3px ${palette.secondary}`,
                    position: "relative", flexShrink: 0,
                  }}
                >
                  📦
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ position: "absolute", inset: "-4px", borderRadius: "18px", border: `2px solid ${palette.accent}` }}
                  />
                </motion.div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: palette.primary, margin: 0 }}>
                    Order Details
                  </h2>
                  <p style={{ color: palette.accent, fontSize: "0.8rem", margin: "3px 0 0", letterSpacing: "0.04em", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    #{order._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
                {/* Status badge */}
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
                  style={{
                    background: status.bg, border: `1px solid ${status.border}`,
                    color: status.color, borderRadius: "20px", padding: "5px 14px",
                    fontSize: "0.78rem", fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 600, letterSpacing: "0.05em", flexShrink: 0,
                  }}
                >
                  {status.icon} {status.label}
                </motion.span>
              </FadeInSection>

              {/* Divider */}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.28, duration: 0.5 }}
                style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)`, marginBottom: "20px" }} />

              {/* Meta info row */}
              <motion.div
                variants={fadeUp} custom={1} initial="hidden" animate="show"
                style={{
                  display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap",
                }}
              >
                {order.createdAt && (
                  <div style={{
                    flex: 1, minWidth: "140px",
                    background: palette.secondary, borderRadius: "12px",
                    padding: "12px 16px",
                    border: `1px solid rgba(212,163,115,0.2)`,
                  }}>
                    <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: palette.accent, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, margin: "0 0 4px" }}>Placed On</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.9rem", color: palette.text, margin: 0, fontWeight: 500 }}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                )}
                <div style={{
                  flex: 1, minWidth: "120px",
                  background: palette.secondary, borderRadius: "12px",
                  padding: "12px 16px",
                  border: `1px solid rgba(212,163,115,0.2)`,
                }}>
                  <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: palette.accent, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, margin: "0 0 4px" }}>Items</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.9rem", color: palette.text, margin: 0, fontWeight: 500 }}>
                    {order.items?.length || 0} {order.items?.length === 1 ? "dish" : "dishes"}
                  </p>
                </div>
              </motion.div>

              {/* Items label */}
              <motion.p
                variants={fadeUp} custom={2} initial="hidden" animate="show"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: palette.primary, fontWeight: 600, marginBottom: "10px" }}
              >
                Items Ordered
              </motion.p>

              {/* Item rows */}
              {order.items?.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} custom={i + 3} initial="hidden" animate="show"
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 16px",
                    background: i % 2 === 0 ? palette.secondary : "rgba(255,252,245,0.7)",
                    borderRadius: "11px", marginBottom: "8px",
                    border: `1px solid rgba(212,163,115,0.18)`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "9px", flexShrink: 0,
                      background: `linear-gradient(135deg, ${palette.primary}22, ${palette.accent}33)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1rem",
                    }}>
                      🍽️
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: "0.95rem", color: palette.primary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </p>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.8rem", color: palette.accent, margin: "1px 0 0" }}>
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "1rem", color: palette.primary, flexShrink: 0, marginLeft: "12px" }}>
                    ₹{item.price * item.quantity}
                  </span>
                </motion.div>
              ))}

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: (order.items?.length || 0) * 0.07 + 0.3, duration: 0.5 }}
                style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)`, margin: "18px 0 16px" }}
              />

              {/* Total */}
              <motion.div
                variants={fadeUp} custom={(order.items?.length || 0) + 4} initial="hidden" animate="show"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px",
                  background: `linear-gradient(135deg, rgba(111,78,55,0.07), rgba(212,163,115,0.12))`,
                  borderRadius: "14px",
                  border: `1.5px solid rgba(212,163,115,0.32)`,
                }}
              >
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "1rem", color: palette.primary, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  Total Paid
                </span>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "1.45rem", color: palette.primary }}>
                  ₹{order.totalAmount}
                </span>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

        <Watermark primaryColor={palette.primary} delay={1} />
      </motion.div>

    </div>
  );
}

export default OrderDetails;