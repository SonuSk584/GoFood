import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const palette = {
  primary: "#6F4E37",
  background: "#F5F5DC",
  secondary: "#EDE0D4",
  text: "#3E3E3E",
  accent: "#D4A373",
};

function FoodCard({ food }) {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = () => {
    if (!food.available || added) return;
    addToCart(food);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, boxShadow: `0 20px 48px rgba(111,78,55,0.18)` }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(255,252,245,0.96)",
        borderRadius: "20px",
        overflow: "hidden",
        border: `1px solid rgba(212,163,115,0.28)`,
        boxShadow: "0 4px 20px rgba(111,78,55,0.09)",
        position: "relative",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        transition: "box-shadow 0.3s",
      }}
    >
      {/* Image container */}
      <div style={{ position: "relative", overflow: "hidden", height: "190px" }}>
        <motion.img
          src={food.img}
          alt={food.name}
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
            filter: food.available ? "none" : "grayscale(60%) brightness(0.85)",
          }}
        />

        {/* Gradient overlay at bottom of image */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 50%, rgba(111,78,55,0.35) 100%)",
          pointerEvents: "none",
        }} />

        {/* Out of stock overlay */}
        {!food.available && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(62,46,35,0.52)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{
              background: "rgba(185,74,59,0.92)",
              color: "#fff", fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700, fontSize: "0.78rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "6px 16px", borderRadius: "20px",
              border: "1.5px solid rgba(255,255,255,0.22)",
            }}>
              Out of Stock
            </span>
          </motion.div>
        )}

        {/* Available badge */}
        {food.available && (
          <motion.div
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              position: "absolute", top: "12px", right: "12px",
              background: "rgba(42,155,74,0.90)",
              color: "#fff", fontSize: "0.68rem",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "4px 10px", borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
            ● Fresh
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px 18px" }}>

        {/* Name + price row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: "1.12rem",
            color: palette.primary, margin: 0,
            lineHeight: 1.25, flex: 1, marginRight: "8px",
          }}>
            {food.name}
          </h3>

          <motion.div
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.25 }}
            style={{
              background: `linear-gradient(135deg, ${palette.primary} 40%, ${palette.accent})`,
              color: "#F5F5DC",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700, fontSize: "0.92rem",
              padding: "4px 11px", borderRadius: "20px",
              flexShrink: 0, letterSpacing: "0.02em",
              boxShadow: "0 2px 8px rgba(111,78,55,0.2)",
            }}
          >
            ₹{food.price}
          </motion.div>
        </div>

        {/* Description if present */}
        {food.description && (
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "0.88rem", color: "#8a7060",
            margin: "0 0 10px", lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {food.description}
          </p>
        )}

        {/* Divider */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0.4, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.35 }}
          style={{
            height: "1px", originX: 0,
            background: `linear-gradient(90deg, ${palette.accent}, transparent)`,
            margin: "10px 0 12px",
          }}
        />

        {/* Add to Cart button */}
        <motion.button
          onClick={handleAdd}
          disabled={!food.available}
          whileHover={food.available ? { scale: 1.025 } : {}}
          whileTap={food.available ? { scale: 0.96 } : {}}
          style={{
            width: "100%", padding: "11px 0",
            borderRadius: "12px", border: "none",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 600, fontSize: "0.92rem",
            letterSpacing: "0.06em", cursor: food.available ? "pointer" : "not-allowed",
            position: "relative", overflow: "hidden",
            background: food.available
              ? `linear-gradient(135deg, ${palette.primary} 50%, #8B6347)`
              : palette.secondary,
            color: food.available ? "#F5F5DC" : "#9a8070",
            boxShadow: food.available ? "0 4px 14px rgba(111,78,55,0.22)" : "none",
            transition: "background 0.25s, box-shadow 0.25s",
          }}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  ✓
                </motion.span>
                Added!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {food.available ? "Add to Cart" : "Unavailable"}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Shimmer on hover */}
          {food.available && (
            <motion.div
              animate={{ x: hovered ? "100%" : "-100%" }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              style={{
                position: "absolute", top: 0, left: 0,
                width: "60%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                pointerEvents: "none",
              }}
            />
          )}
        </motion.button>
      </div>

      {/* Bottom accent line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "3px", originX: 0.5,
          background: `linear-gradient(90deg, transparent, ${palette.accent}, ${palette.primary}, ${palette.accent}, transparent)`,
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Cormorant+Garamond:wght@400;500;600&display=swap');
      `}</style>
    </motion.div>
  );
}

export default FoodCard;