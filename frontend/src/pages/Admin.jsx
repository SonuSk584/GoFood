import { useState, useContext, useEffect } from "react";
import client from "../api/client";
import { AuthContext } from "../context/Authcontext";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FadeInSection from "../components/motion/FadeInSection";
import { fadeUpCompact } from "../animations/variants";

function Admin() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <Navigate to="/home" />;
  }

  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const delivered = orders.filter(o => o.status === "Delivered").length;

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("image", image);
      await client.post("/admin/add-food", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Food added ✅");
      setForm({ name: "", price: "", category: "" });
      setImage(null);
      setPreview(null);
      fetchFoods();
    } catch { alert("Failed ❌"); }
  };

  const fetchFoods = async () => {
    const res = await client.get("/admin/foods");
    setFoods(res.data);
  };

  const deleteFood = async (id) => {
    await client.delete(`/admin/food/${id}`);
    fetchFoods();
  };

  const updateFood = async () => {
    await client.put(`/admin/food/${editing._id}`, editing);
    alert("Updated ✅");
    setEditing(null);
    fetchFoods();
  };

  const toggleStock = async (id) => {
    await client.put(`/admin/toggle-stock/${id}`, {});
    fetchFoods();
  };

  const fetchOrders = async () => {
    const res = await client.get("/admin/orders");
    setOrders(res.data);
  };

  const updateOrder = async (id, status) => {
    await client.put(`/admin/order/${id}`, { status });
    fetchOrders();
  };

  useEffect(() => { fetchFoods(); fetchOrders(); }, []);

  const statusBadge = (status) => {
    const map = {
      Pending: { bg: "#FFF3CD", color: "#856404" },
      Preparing: { bg: "#FFF0E0", color: "#A0522D" },
      Delivered: { bg: "#D8F3DC", color: "#2D6A4F" },
    };
    const s = map[status] || map.Pending;
    return (
      <span style={{
        background: s.bg, color: s.color,
        fontSize: 11, padding: "3px 10px", borderRadius: 8, fontWeight: 500
      }}>
        {status}
      </span>
    );
  };

  return (
    <>
      {/*
        Note: all @keyframes now live in src/styles/keyframes.css,
        imported once at the app root. Only component-scoped, non-animation
        CSS (input/button styling) stays here.
      */}
      <style>{`
        .adm-input {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #EDE0D4; border-radius: 10px;
          font-size: 13px; color: #3E3E3E; background: #FAFAF5;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .adm-input:focus {
          border-color: #D4A373;
          box-shadow: 0 0 0 3px rgba(212,163,115,0.15);
          background: #fff;
        }
        .adm-input::placeholder { color: #b8a898; }
        .adm-btn {
          padding: 10px 20px; border-radius: 10px; border: none;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .adm-btn:active { transform: scale(0.97); }
        .adm-btn-primary { background: #6F4E37; color: #fff; }
        .adm-btn-primary:hover { background: #5A3D28; }
        .adm-btn-ghost { background: #EDE0D4; color: #6F4E37; }
        .adm-btn-ghost:hover { background: #ddd0c4; }
        .adm-btn-danger { background: #FFF0F0; color: #C0392B; border: 1px solid #f5c6c6; }
        .adm-btn-danger:hover { background: #ffe0e0; }
        .adm-btn-sm { padding: 6px 12px !important; font-size: 12px !important; border-radius: 8px !important; }
        .adm-food-row:hover { background: #FAFAF5; border-radius: 10px; }
        .adm-status-select {
          padding: 7px 12px; border-radius: 8px;
          border: 1.5px solid #D4A373;
          font-size: 12px; color: #3E3E3E;
          background: #fff; outline: none; cursor: pointer;
        }
        .adm-file-label {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          border: 1.5px dashed #D4A373; border-radius: 10px;
          cursor: pointer; font-size: 13px; color: #9b8574;
          background: #FAFAF5; transition: background 0.2s;
        }
        .adm-file-label:hover { background: #f5ede3; }
      `}</style>

      <div style={{ background: "#F5F5DC", minHeight: "100vh", fontFamily: "sans-serif", color: "#3E3E3E" }}>

        {/* TOP NAV */}
        <div style={{
          background: "#6F4E37", padding: "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "3px solid #D4A373",
          position: "sticky", top: 0, zIndex: 50
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, fontWeight: 500, color: "#fff" }}>
            ⚙️ Admin Panel
            <span style={{
              background: "#D4A373", color: "#5A3D28",
              fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 10
            }}>GoFood</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            Welcome, {user?.name || "Admin"}
          </span>
        </div>

        {/* STAT CARDS — staggered fade-up via shared fadeUp variant */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12, padding: "20px 24px 0"
        }}>
          {[
            { icon: "💰", label: "Total Revenue", val: `₹${totalRevenue}` },
            { icon: "📦", label: "Total Orders", val: orders.length },
            { icon: "✅", label: "Delivered", val: delivered },
            { icon: "🍽️", label: "Menu Items", val: foods.length },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUpCompact}
              custom={i}
              initial="hidden"
              animate="show"
              style={{
                background: "#fff", borderRadius: 16,
                border: "1px solid #EDE0D4", padding: "16px 18px"
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 12, color: "#9b8574", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#6F4E37" }}>{s.val}</div>
            </motion.div>
          ))}
        </div>

        {/* ADD FOOD */}
        <FadeInSection
          delay={0.1}
          style={{
            background: "#fff", borderRadius: 18,
            border: "1px solid #EDE0D4", padding: 20, margin: "16px 24px 0"
          }}
        >
          <div style={{
            fontSize: 15, fontWeight: 500, color: "#6F4E37",
            marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #EDE0D4",
            display: "flex", alignItems: "center", gap: 8
          }}>
            🍔 Add Food Item
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <input
              className="adm-input"
              placeholder="Food name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="adm-input"
              placeholder="Price (₹)"
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
            <input
              className="adm-input"
              style={{ gridColumn: "1 / -1" }}
              placeholder="Category (food / drink)"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            />
          </div>

          <label className="adm-file-label">
            📁 {image ? image.name : "Choose image"}
            <input type="file" style={{ display: "none" }} onChange={handleImage} />
          </label>

          {preview && (
            <img
              src={preview}
              style={{
                width: 80, height: 80, borderRadius: 10,
                objectFit: "cover", border: "1.5px solid #EDE0D4", marginTop: 10
              }}
            />
          )}

          <div style={{ marginTop: 14 }}>
            <button className="adm-btn adm-btn-primary" onClick={handleSubmit}>
              + Add Food
            </button>
          </div>
        </FadeInSection>

        {/* EDIT BANNER */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{
                background: "#FFF8F0", border: "1.5px solid #D4A373",
                borderRadius: 14, padding: "14px 18px",
                margin: "12px 24px 0",
                display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"
              }}
            >
              <span style={{ fontSize: 13, color: "#9b8574", whiteSpace: "nowrap" }}>Editing:</span>
              <input
                className="adm-input"
                style={{ flex: 1, minWidth: 100 }}
                value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
              />
              <input
                className="adm-input"
                style={{ width: 90 }}
                value={editing.price}
                onChange={e => setEditing({ ...editing, price: e.target.value })}
              />
              <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={updateFood}>Save</button>
              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setEditing(null)}>Cancel</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRODUCTS */}
        <FadeInSection
          delay={0.15}
          style={{
            background: "#fff", borderRadius: 18,
            border: "1px solid #EDE0D4", padding: 20, margin: "16px 24px 0"
          }}
        >
          <div style={{
            fontSize: 15, fontWeight: 500, color: "#6F4E37",
            marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #EDE0D4"
          }}>
            📋 Menu Items
          </div>

          {foods.map(food => (
            <div
              key={food._id}
              className="adm-food-row"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 6px", borderBottom: "1px solid #f5ede3",
                gap: 10, transition: "background 0.15s"
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                objectFit: "cover", border: "1px solid #EDE0D4",
                background: "#EDE0D4", flexShrink: 0,
                overflow: "hidden"
              }}>
                {food.img
                  ? <img src={food.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🍽️</div>
                }
              </div>

              <div style={{ flex: 1, minWidth: 0, padding: "0 10px" }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{food.name}</div>
                <div style={{ fontSize: 13, color: "#6F4E37", fontWeight: 500 }}>₹{food.price}</div>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 8,
                  background: food.available ? "#D8F3DC" : "#FFF0F0",
                  color: food.available ? "#2D6A4F" : "#C0392B"
                }}>
                  {food.available ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setEditing(food)}>Edit</button>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => toggleStock(food._id)}>
                  {food.available ? "Disable" : "Enable"}
                </button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => deleteFood(food._id)}>Delete</button>
              </div>
            </div>
          ))}

          {foods.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 0", color: "#b8a898", fontSize: 14 }}>
              No food items yet. Add one above!
            </div>
          )}
        </FadeInSection>

        {/* ORDERS */}
        <FadeInSection
          delay={0.2}
          style={{
            background: "#fff", borderRadius: 18,
            border: "1px solid #EDE0D4", padding: 20,
            margin: "16px 24px 24px"
          }}
        >
          <div style={{
            fontSize: 15, fontWeight: 500, color: "#6F4E37",
            marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #EDE0D4"
          }}>
            📦 Orders
          </div>

          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              variants={fadeUpCompact}
              custom={i}
              initial="hidden"
              animate="show"
              style={{
                background: "#FAFAF5", border: "1px solid #EDE0D4",
                borderRadius: 12, padding: "14px 16px", marginBottom: 10
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: "#6F4E37" }}>₹{order.totalAmount}</span>
                {statusBadge(order.status)}
              </div>

              <div style={{ fontSize: 13, marginBottom: 6 }}>
                👤 <b>{order.userId?.name || "Unknown"}</b>
              </div>

              <div style={{ fontSize: 12, color: "#7a6a5a", marginBottom: 4 }}>
                📧 {order.userId?.email || "No email"}
              </div>

              <div style={{ fontSize: 12, color: "#7a6a5a", marginBottom: 8 }}>
                📍 {order.userId?.location?.[0]?.address || "No location"}
              </div>

              <div style={{ fontSize: 12, color: "#9b8574", marginBottom: 10 }}>
                {order.items?.map((item, j) => (
                  <span key={j}>
                    {item.name} × {item.quantity}
                    {j < order.items.length - 1 ? "  ·  " : ""}
                  </span>
                ))}
              </div>

              <select
                className="adm-status-select"
                value={order.status}
                onChange={e => updateOrder(order._id, e.target.value)}
              >
                <option>Pending</option>
                <option>Preparing</option>
                <option>On the way</option>
              </select>
            </motion.div>
          ))}

          {orders.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 0", color: "#b8a898", fontSize: 14 }}>
              No orders yet.
            </div>
          )}
        </FadeInSection>

      </div>
    </>
  );
}

export default Admin;