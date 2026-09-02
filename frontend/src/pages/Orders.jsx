import { useEffect, useState } from "react";
import client from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import DecorativeRings from "../components/motion/DecorativeRings";
import AccentBar from "../components/motion/AccentBar";
import Divider from "../components/motion/Divider";
import PulseBadge from "../components/motion/PulseBadge";
import Watermark from "../components/motion/Watermark";
import Skeleton from "../components/motion/Skeleton";
import FadeInSection from "../components/motion/FadeInSection";
import { makeStagger, cardEntrance } from "../animations/variants";

const palette = {
  primary: "#6F4E37",
  background: "#F5F5DC",
  secondary: "#EDE0D4",
  text: "#3E3E3E",
  accent: "#D4A373",
};

const statusConfig = {
  pending: { color: "#b97a2a", bg: "rgba(212,163,115,0.18)", border: "rgba(212,163,115,0.4)", icon: "⏳", label: "Pending" },
  confirmed: { color: "#2a7ab9", bg: "rgba(42,122,185,0.10)", border: "rgba(42,122,185,0.3)", icon: "✅", label: "Confirmed" },
  preparing: { color: "#7a4fb9", bg: "rgba(122,79,185,0.10)", border: "rgba(122,79,185,0.3)", icon: "👨‍🍳", label: "Preparing" },
  delivered: { color: "#2a9b4a", bg: "rgba(42,155,74,0.10)", border: "rgba(42,155,74,0.3)", icon: "🎉", label: "Delivered" },
  cancelled: { color: "#b94a3b", bg: "rgba(185,74,59,0.09)", border: "rgba(185,74,59,0.28)", icon: "✕", label: "Cancelled" },
};

function getStatus(raw = "") {
  const key = raw.toLowerCase();
  return statusConfig[key] || { color: palette.primary, bg: palette.secondary, border: palette.accent, icon: "📦", label: raw };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// This page's own fade-up timing (24px rise, 0.08s/step) — see makeStagger in variants.js
const fadeUp = makeStagger({ y: 24, delayStep: 0.08, duration: 0.45 });

function OrderCard({ order, i }) {
  const [open, setOpen] = useState(false);
  const status = getStatus(order.status);

  return (
    <motion.div
      layout
      variants={fadeUp}
      custom={i}
      initial="hidden"
      animate="show"
      style={{
        background: "rgba(255,252,245,0.9)",
        border: `1px solid rgba(212,163,115,0.22)`,
        borderRadius: "16px",
        marginBottom: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(111,78,55,0.07)",
      }}
    >
      {/* Main row */}
      <motion.div
        onClick={() => setOpen(o => !o)}
        whileHover={{ background: "rgba(237,224,212,0.55)" }}
        style={{
          display: "flex", alignItems: "center", gap: "14px",
          padding: "16px 20px", cursor: "pointer",
          transition: "background 0.18s",
        }}
      >
        {/* Order icon */}
        <div style={{
          width: "44px", height: "44px", flexShrink: 0,
          background: `linear-gradient(135deg, ${palette.primary} 40%, ${palette.accent})`,
          borderRadius: "12px", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: "1.3rem",
          boxShadow: `0 2px 10px rgba(111,78,55,0.18)`,
        }}>
          📦
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: "0.98rem",
            color: palette.primary, margin: 0,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            Order #{order._id?.slice(-6).toUpperCase()}
          </p>
          {order.createdAt && (
            <p style={{ color: palette.accent, fontSize: "0.78rem", margin: "2px 0 0", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.04em" }}>
              {formatDate(order.createdAt)}
            </p>
          )}
        </div>

        {/* Amount */}
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: "1.1rem",
          color: palette.primary, flexShrink: 0,
        }}>
          ₹{order.totalAmount}
        </span>

        {/* Status badge */}
        <span style={{
          background: status.bg,
          border: `1px solid ${status.border}`,
          color: status.color,
          borderRadius: "20px", padding: "4px 12px",
          fontSize: "0.75rem", fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 600, letterSpacing: "0.05em",
          flexShrink: 0, whiteSpace: "nowrap",
        }}>
          {status.icon} {status.label}
        </span>
        {order.otp && (
          <span style={{ fontSize: "0.8rem", color: "#4caf50" }}>
            🔐 OTP: <b>{order.otp}</b>
          </span>
        )}

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color: palette.accent, fontSize: "0.9rem", flexShrink: 0, lineHeight: 1 }}
        >
          ▾
        </motion.span>
      </motion.div>

      {/* Expandable items */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              borderTop: `1px solid rgba(212,163,115,0.22)`,
              padding: "14px 20px 18px",
              background: palette.secondary,
            }}>
              {order.items && order.items.length > 0 ? (
                <>
                  <p style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.72rem", letterSpacing: "0.12em",
                    textTransform: "uppercase", color: palette.primary,
                    fontWeight: 600, marginBottom: "10px", marginTop: 0,
                  }}>
                    Items Ordered
                  </p>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", padding: "7px 0",
                      borderBottom: idx < order.items.length - 1 ? `1px solid rgba(212,163,115,0.18)` : "none",
                    }}>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "0.97rem", color: palette.text,
                      }}>
                        {item.name}
                        <span style={{ color: palette.accent, marginLeft: "6px", fontSize: "0.82rem" }}>
                          × {item.quantity || 1}
                        </span>
                      </span>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "0.97rem", color: palette.primary, fontWeight: 600,
                      }}>
                        ₹{item.price * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginTop: "12px", paddingTop: "10px",
                    borderTop: `1.5px solid rgba(111,78,55,0.15)`,
                  }}>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "0.9rem", color: palette.primary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "1rem", color: palette.primary }}>₹{order.totalAmount}</span>
                  </div>
                </>
              ) : (
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: palette.accent, fontSize: "0.9rem", margin: 0 }}>
                  No item details available.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/order/myorders")
      .then(res => {
        console.log("MY ORDERS:", res.data);
        setOrders(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

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
          width: "100%", maxWidth: "560px",
          position: "relative",
          border: `1px solid rgba(212,163,115,0.25)`,
        }}
      >
        <AccentBar accentColor={palette.accent} primaryColor={palette.primary} delay={0.2} />

        {/* Header */}
        <FadeInSection
          delay={0.22}
          duration={0.44}
          style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}
        >
          <PulseBadge
            size={54}
            borderRadius={15}
            background={`linear-gradient(135deg, ${palette.primary} 40%, ${palette.accent})`}
            accentColor={palette.accent}
            secondaryColor={palette.secondary}
            hoverAnimate={{ rotate: [0, -10, 10, 0] }}
          >
            📦
          </PulseBadge>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: palette.primary, margin: 0 }}>
              My Orders
            </h2>
            <p style={{ color: palette.accent, fontSize: "0.84rem", margin: "2px 0 0", letterSpacing: "0.05em" }}>
              {loading ? "Loading…" : `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`}
            </p>
          </div>
        </FadeInSection>

        <Divider accentColor={palette.accent} delay={0.35} style={{ marginBottom: "22px" }} />

        {/* Loading shimmer */}
        <AnimatePresence>
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[1, 2, 3].map(n => (
                <Skeleton key={n} height={72} borderRadius={16} delay={n * 0.15} style={{ marginBottom: 12 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", padding: "44px 0 36px" }}
          >
            <motion.div
              animate={{ y: [-6, 6, -6] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "3.2rem", marginBottom: "16px" }}
            >
              🍽️
            </motion.div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", color: palette.primary, fontWeight: 600, margin: 0 }}>
              No orders yet
            </p>
            <p style={{ color: palette.accent, fontSize: "0.88rem", marginTop: "6px", letterSpacing: "0.04em" }}>
              Your delicious orders will appear here
            </p>
          </motion.div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <AnimatePresence>
            {orders.map((order, i) => (
              <OrderCard key={order._id} order={order} i={i} />
            ))}
          </AnimatePresence>
        )}

        <Watermark primaryColor={palette.primary} delay={0.9} />
      </motion.div>

    </div>
  );
}

export default Orders;