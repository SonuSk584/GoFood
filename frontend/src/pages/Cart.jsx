import { useContext } from "react";
import client from "../api/client";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import FadeInSection from "../components/motion/FadeInSection";
import AnimatedIconButton from "../components/motion/AnimatedIconButton";
import DecorativeRings from "../components/motion/DecorativeRings";
import AccentBar from "../components/motion/AccentBar";
import Watermark from "../components/motion/Watermark";
import { fadeUp, exitLeft, cardEntrance, valuePop } from "../animations/variants";

const palette = {
  primary: "#6F4E37",
  background: "#F5F5DC",
  secondary: "#EDE0D4",
  text: "#3E3E3E",
  accent: "#D4A373",
};

function CartItem({ item, i, increaseQty, decreaseQty, removeFromCart }) {
  return (
    <motion.div
      layout
      variants={fadeUp}
      custom={i}
      initial="hidden"
      animate="show"
      exit={exitLeft}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        background: palette.secondary,
        borderRadius: "14px",
        marginBottom: "10px",
        border: `1px solid rgba(212,163,115,0.22)`,
        gap: "12px",
      }}
    >
      {/* Name */}
      <span style={{
        flex: 1,
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 600,
        fontSize: "1rem",
        color: palette.primary,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {item.name}
      </span>

      {/* Qty controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <AnimatedIconButton
          hover={{ scale: 1.12, background: palette.primary }}
          onClick={() => decreaseQty(item._id)}
          style={{
            width: "30px", height: "30px", borderRadius: "8px",
            border: `1.5px solid ${palette.accent}`,
            background: "rgba(255,252,245,0.85)",
            color: palette.primary,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: "1.1rem",
            transition: "background 0.18s, color 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = palette.primary; e.currentTarget.style.color = "#F5F5DC"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,252,245,0.85)"; e.currentTarget.style.color = palette.primary; }}
        >−</AnimatedIconButton>

        <motion.span
          key={item.quantity}
          {...valuePop}
          style={{
            minWidth: "22px", textAlign: "center",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: "1rem", color: palette.text,
          }}
        >
          {item.quantity || 1}
        </motion.span>

        <AnimatedIconButton
          onClick={() => increaseQty(item._id)}
          style={{
            width: "30px", height: "30px", borderRadius: "8px",
            border: `1.5px solid ${palette.accent}`,
            background: "rgba(255,252,245,0.85)",
            color: palette.primary,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: "1.1rem",
            transition: "background 0.18s, color 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = palette.primary; e.currentTarget.style.color = "#F5F5DC"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,252,245,0.85)"; e.currentTarget.style.color = palette.primary; }}
        >+</AnimatedIconButton>
      </div>

      {/* Price */}
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 600, fontSize: "1.05rem",
        color: palette.primary, minWidth: "60px",
        textAlign: "right", flexShrink: 0,
      }}>
        ₹{item.price * (item.quantity || 1)}
      </span>

      {/* Remove */}
      <AnimatedIconButton
        hover={{ scale: 1.15, rotate: 10 }}
        tap={{ scale: 0.88 }}
        onClick={() => removeFromCart(item._id)}
        title="Remove item"
        style={{
          background: "rgba(185,74,59,0.09)",
          border: "1px solid rgba(185,74,59,0.22)",
          borderRadius: "8px", width: "30px", height: "30px",
          fontSize: "0.85rem", flexShrink: 0,
          transition: "background 0.18s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(185,74,59,0.18)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(185,74,59,0.09)"}
      >
        ✕
      </AnimatedIconButton>
    </motion.div>
  );
}

function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useContext(CartContext);
  const navigate = useNavigate();
  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const checkout = async () => {
    try {
      const res = await client.post("/payment/create", { amount: total });
      const order = res.data;
      const options = {
        key: "rzp_test_SdMCfwYqvB3E19",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        method: { upi: true, card: true, netbanking: true, wallet: true },
        name: "GoFood",
        description: "Food Order Payment",
        handler: async function (response) {
          try {
            console.log("SUCCESS:", response);

            const user = JSON.parse(localStorage.getItem("user"));

            const verify = await client.post("/payment/verify", {
              ...response,
              items: cart,
              totalAmount: total,
              userId: user?._id
            });

            if (verify.data.success) {
              localStorage.removeItem("cart");
              navigate("/order-placed");
            }

          } catch (err) {
            console.log(err);
            alert("Verification failed ❌");
          }
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed ❌");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 25% 15%, #EDE0D4 0%, #F5F5DC 55%, #e8e4c9 100%)`,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "48px 16px",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Decorative rings */}
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
          width: "100%",
          maxWidth: "520px",
          position: "relative",
          border: `1px solid rgba(212,163,115,0.25)`,
        }}
      >
        {/* Top accent bar */}
        <AccentBar accentColor={palette.accent} primaryColor={palette.primary} delay={0.2} />

        {/* Header */}
        <FadeInSection
          delay={0.22}
          duration={0.44}
          style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}
        >
          <motion.div
            whileHover={{ rotate: [0, -12, 12, 0] }}
            transition={{ duration: 0.5 }}
            style={{
              width: "52px", height: "52px",
              background: `linear-gradient(135deg, ${palette.primary} 40%, ${palette.accent})`,
              borderRadius: "14px", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem",
              boxShadow: `0 4px 16px rgba(111,78,55,0.22), 0 0 0 3px ${palette.secondary}`,
              position: "relative",
            }}
          >
            🛒
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ position: "absolute", inset: "-4px", borderRadius: "17px", border: `2px solid ${palette.accent}` }}
            />
          </motion.div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.7rem", fontWeight: 700, color: palette.primary, margin: 0 }}>
              Your Cart
            </h2>
            <p style={{ color: palette.accent, fontSize: "0.85rem", margin: 0, letterSpacing: "0.05em" }}>
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>
        </FadeInSection>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.35, duration: 0.5 }}
          style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)`, marginBottom: "22px" }}
        />

        {/* Empty state */}
        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "40px 0 32px" }}
            >
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: "3.2rem", marginBottom: "16px" }}
              >
                🍽️
              </motion.div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", color: palette.primary, fontWeight: 600, margin: 0 }}>
                Your cart is empty
              </p>
              <p style={{ color: palette.accent, fontSize: "0.88rem", marginTop: "6px", letterSpacing: "0.04em" }}>
                Add some delicious items!
              </p>
            </motion.div>
          ) : (
            <motion.div key="items" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AnimatePresence>
                {cart.map((item, i) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    i={i}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total + Checkout */}
        {cart.length > 0 && (
          <FadeInSection delay={0.4} y={16} duration={0.45}>
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.45, duration: 0.5 }}
              style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)`, margin: "18px 0 16px" }}
            />

            {/* Total row */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 18px",
              background: palette.secondary,
              borderRadius: "14px",
              border: `1px solid rgba(212,163,115,0.3)`,
              marginBottom: "18px",
            }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: "1rem", color: palette.text, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Total
              </span>
              <motion.span
                key={total}
                initial={{ scale: 1.15, color: palette.accent }}
                animate={{ scale: 1, color: palette.primary }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "1.35rem", color: palette.primary }}
              >
                ₹{total}
              </motion.span>
            </div>

            {/* Checkout button */}
            <motion.button
              onClick={checkout}
              whileHover={{ scale: 1.025, y: -2, boxShadow: `0 10px 30px rgba(111,78,55,0.26)` }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%", padding: "14px 0", borderRadius: "14px",
                background: `linear-gradient(135deg, ${palette.primary} 50%, #8B6347)`,
                color: "#F5F5DC", border: "none",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.05rem", fontWeight: 700, letterSpacing: "0.08em",
                cursor: "pointer", position: "relative", overflow: "hidden",
              }}
            >
              <motion.span
                style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.07)", borderRadius: "14px", opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              💳 Proceed to Checkout &nbsp;·&nbsp; ₹{total}
            </motion.button>
          </FadeInSection>
        )}

        {/* Watermark */}
        <Watermark primaryColor={palette.primary} delay={0.9} />
      </motion.div>

      {/* Font import moved to src/styles/keyframes.css, imported once at app root */}
    </div>
  );
}

export default Cart;