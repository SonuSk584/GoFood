import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";
import LocationPicker from "../components/LocationPicker";
import FoodBackground from "../components/FoodBackground";
import AccentBar from "../components/motion/AccentBar";
import Divider from "../components/motion/Divider";
import PulseBadge from "../components/motion/PulseBadge";
import Watermark from "../components/motion/Watermark";
import { makeStagger, cardEntrance } from "../animations/variants";

const palette = {
  primary: "#6F4E37",
  background: "#F5F5DC",
  secondary: "#EDE0D4",
  text: "#3E3E3E",
  accent: "#D4A373",
};

// This page's own fade-up timing (30px rise, 0.09s/step) — see makeStagger in variants.js
const fadeUp = makeStagger({ y: 30, delayStep: 0.09, duration: 0.5 });

function PremiumButton({ onClick, disabled, children, variant = "primary" }) {
  const styles = {
    primary: { background: `linear-gradient(135deg, ${palette.primary} 60%, #8B6347)`, color: "#F5F5DC", border: "none" },
    secondary: { background: palette.secondary, color: palette.primary, border: `1.5px solid ${palette.accent}` },
    accent: { background: `linear-gradient(135deg, ${palette.accent} 60%, #C8956A)`, color: "#3E3E3E", border: "none" },
    danger: { background: "linear-gradient(135deg, #b94a3b 60%, #c0392b)", color: "#fff", border: "none" },
  };
  return (
    <motion.button
      whileHover={{ scale: 1.025, y: -2, boxShadow: `0 8px 28px rgba(111,78,55,0.22)` }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        width: "100%", padding: "12px 0", borderRadius: "12px",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 600, fontSize: "0.97rem", letterSpacing: "0.06em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        position: "relative", overflow: "hidden",
      }}
    >
      {children}
    </motion.button>
  );
}

function Profile() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.location || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setLocation(user?.location || null);
  }, [user]);

  const saveProfile = async () => {
    try {
      setLoading(true);
      const res = await client.put("/user/update", { name });
      updateUser(res.data);
      alert("Profile updated ✅");
      setEditMode(false);
    } catch (err) { console.log(err); alert("Failed ❌"); }
    finally { setLoading(false); }
  };

  const saveLocation = async () => {
    try {
      if (!location || !location.lat || !location.lng) return alert("Please select a valid location 📍");
      setLoading(true);
      const res = await client.put("/user/update-location", { location });
      updateUser(res.data);
      alert("Location updated 📍");
      setEditLocation(false);
    } catch (err) { console.log(err); alert("Failed to update location ❌"); }
    finally { setLoading(false); }
  };

  return (
    <FoodBackground>
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "16px", paddingBottom: "16px" }}>
        <motion.div
          variants={cardEntrance}
          initial="hidden"
          animate="show"
          style={{
            background: "rgba(255,252,245,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: `0 8px 48px rgba(111,78,55,0.14), 0 1.5px 0 ${palette.accent} inset`,
            borderRadius: "24px",
            padding: "40px 36px 36px",
            width: "100%",
            maxWidth: "420px",
            position: "relative",
            border: `1px solid rgba(212,163,115,0.25)`,
          }}
        >
          <AccentBar accentColor={palette.accent} primaryColor={palette.primary} delay={0.2} />

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.15, type: "spring", stiffness: 200 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}
          >
            <PulseBadge
              size={86}
              borderRadius="50%"
              background={`linear-gradient(135deg, ${palette.primary} 40%, ${palette.accent})`}
              accentColor={palette.accent}
              secondaryColor={palette.secondary}
              ringInset={-6}
              hoverAnimate={{ scale: 1.06, rotate: 3 }}
              hoverTransition={{ type: "spring", stiffness: 300 }}
              fontSize="2.2rem"
              style={{
                color: "#F5F5DC",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </PulseBadge>
            <motion.h2
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ marginTop: "14px", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.45rem", fontWeight: 700, color: palette.primary }}
            >{user?.name || "User"}</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
              style={{ color: palette.accent, fontSize: "0.88rem", marginTop: "2px", letterSpacing: "0.04em" }}>
              {user?.email}
            </motion.p>
          </motion.div>

          <Divider accentColor={palette.accent} delay={0.4} style={{ marginBottom: "22px" }} />

          {/* Name */}
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: palette.primary, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}>Name</label>
            <AnimatePresence mode="wait">
              {editMode ? (
                <motion.input key="input" initial={{ opacity: 0, scaleY: 0.8 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0.8 }}
                  value={name} onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", marginTop: "6px", padding: "10px 14px", borderRadius: "10px", border: `1.5px solid ${palette.accent}`, background: palette.secondary, color: palette.text, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.border = `1.5px solid ${palette.primary}`}
                  onBlur={e => e.target.style.border = `1.5px solid ${palette.accent}`}
                />
              ) : (
                <motion.p key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ marginTop: "5px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.08rem", color: palette.text, fontWeight: 500 }}>
                  {name}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Location */}
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: palette.primary, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}>Location</label>
            <AnimatePresence mode="wait">
              {!editLocation ? (
                <motion.div key="loc-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p style={{ fontSize: "0.95rem", marginTop: "5px", color: palette.text, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {location?.[0]?.address || "No location set"}
                  </p>
                  <motion.button whileHover={{ x: 4 }} onClick={() => setEditLocation(true)}
                    style={{ background: "none", border: "none", color: palette.accent, fontFamily: "'Playfair Display', Georgia, serif", fontSize: "0.85rem", cursor: "pointer", marginTop: "6px", padding: 0, letterSpacing: "0.04em", fontWeight: 600 }}>
                    📍 Change Location →
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div key="loc-edit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ marginTop: "8px" }}>
                  <LocationPicker setLocation={setLocation} />
                  <AnimatePresence>
                    {location && (
                      <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ fontSize: "0.85rem", color: "#4a8a4a", marginTop: "8px", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                        📍 {location?.[0]?.address || "Location selected"}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <div style={{ marginTop: "12px" }}>
                    <PremiumButton onClick={saveLocation} disabled={loading}>
                      {loading ? "Saving…" : "Save Location"}
                    </PremiumButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <Divider accentColor={palette.accent} delay={0.55} style={{ marginBottom: "22px", marginTop: "10px" }} />

          {/* Buttons */}
          <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <AnimatePresence mode="wait">
              {!editMode ? (
                <motion.div key="edit-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PremiumButton onClick={() => setEditMode(true)} variant="secondary">✏️ Edit Profile</PremiumButton>
                </motion.div>
              ) : (
                <motion.div key="save-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PremiumButton onClick={saveProfile} disabled={loading}>
                    {loading ? "Saving…" : "✅ Save Changes"}
                  </PremiumButton>
                </motion.div>
              )}
            </AnimatePresence>
            <PremiumButton onClick={() => navigate("/orders")} variant="accent">📦 View Orders</PremiumButton>
            <PremiumButton onClick={() => { logout(); navigate("/"); }} variant="danger">Logout</PremiumButton>
          </motion.div>

          <Watermark primaryColor={palette.primary} delay={0.9} opacity={0.35} fontSize="0.7rem" />
        </motion.div>
      </div>
    </FoodBackground>
  );
}

export default Profile;