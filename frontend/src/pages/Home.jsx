import { useEffect, useState, useContext } from "react";
import client from "../api/client";
import FoodCard from "../components/FoodCard";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo";
import { useLogoBikeAnimation } from "../animations/useLogoBikeAnimation";

function Home() {
  const [foods, setFoods] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Bike → letter bounce animation (see src/animations/useLogoBikeAnimation.js).
  // NOTE: in the original file these refs weren't attached to any element in
  // the JSX shown — they're presumably meant to be forwarded into Logo.jsx
  // (which renders the actual letters/road markup). Wire lettersRef/roadRef
  // into Logo's props the same way your original code intended; I haven't
  // changed that wiring here since I don't have Logo.jsx's source.
  const { lettersRef, roadRef } = useLogoBikeAnimation({ letterCount: 6 });

  // Fetch foods
  useEffect(() => {
    client.get("/food")
      .then(res => setFoods(res.data));
  }, []);

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => setSearch(input), 300);
    return () => clearTimeout(delay);
  }, [input]);

  // Filter + sort
  let filtered = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "all" || f.category === category)
  );

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const logoLetters = ["G", "o", "F", "o", "o", "d"];

  return (
    <>
      {/*
        @keyframes letterBounce / bikeRide now live in src/styles/keyframes.css
        (imported once at app root). Only page-scoped, non-animation CSS stays here.
      */}
      <style>{`
        .gf-letter {
          font-size: 22px;
          font-weight: 500;
          color: #fff;
          display: inline-block;
          line-height: 1;
        }
        .gf-letter.bounce {
          animation: letterBounce 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
        }
        .gf-bike {
          position: absolute;
          top: -3px;
          font-size: 14px;
          line-height: 1;
          animation: bikeRide 3.2s linear infinite;
        }
        .gf-road-dashes::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to right,
            rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 6px,
            transparent 6px, transparent 14px
          );
        }
        .gf-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #EDE0D4;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .gf-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(111,78,55,0.12);
        }
        .gf-add-btn:hover {
          background: #5A3D28 !important;
          transform: scale(1.1);
        }
        .gf-dropdown-item:hover {
          background: #EDE0D4 !important;
        }
      `}</style>

      <div style={{ background: "#F5F5DC", minHeight: "100vh", color: "#3E3E3E", fontFamily: "sans-serif" }}>

        {/* NAVBAR */}
        <div style={{
          background: "#6F4E37",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "3px solid #D4A373"
        }}>
          {/* Logo */}
          <div style={{
            display: "flex",
            alignItems: "center",
            height: 40
          }}>
            <div style={{
              transform: "scale(0.6)",
              transformOrigin: "left center"
            }}>
              <Logo />
            </div>
          </div>

          {/* Desktop search */}
          <input
            placeholder="Search food..."
            className="hidden md:block"
            style={{
              padding: "8px 16px",
              borderRadius: 24,
              border: "none",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              width: 220,
              fontSize: 13,
              outline: "none"
            }}
            onChange={(e) => setInput(e.target.value)}
          />

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

            {/* Cart */}
            <div
              onClick={() => navigate("/cart")}
              style={{ position: "relative", cursor: "pointer", fontSize: 22, lineHeight: 1 }}
            >
              🛒
              {totalItems > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  background: "#E63946", color: "#fff",
                  fontSize: 10, fontWeight: 500,
                  minWidth: 18, height: 18, borderRadius: 9,
                  display: "flex", alignItems: "center",
                  justifyContent: "center", padding: "0 4px"
                }}>
                  {totalItems}
                </span>
              )}
            </div>

            {/* User */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowMenu(!showMenu)}
                style={{ cursor: "pointer", fontSize: 22, lineHeight: 1 }}
              >
                👤
              </div>

              {showMenu && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 10px)",
                  background: "#fff", border: "1px solid #EDE0D4",
                  borderRadius: 14,
                  boxShadow: "0 8px 28px rgba(111,78,55,0.15)",
                  width: 180, padding: "10px 0", zIndex: 100
                }}>
                  <p style={{
                    padding: "4px 16px 10px",
                    borderBottom: "1px solid #EDE0D4",
                    fontWeight: 500, fontSize: 14,
                    color: "#3E3E3E", marginBottom: 4
                  }}>
                    {user?.name || "User"}
                  </p>

                  {user?.role === "admin" && (
                    <button
                      className="gf-dropdown-item"
                      onClick={() => navigate("/admin")}
                      style={{
                        padding: "7px 16px", fontSize: 13,
                        color: "#7B2D8B", cursor: "pointer",
                        display: "block", width: "100%",
                        textAlign: "left", background: "none", border: "none"
                      }}
                    >
                      Admin Panel ⚙️
                    </button>
                  )}

                  <button
                    className="gf-dropdown-item"
                    onClick={() => navigate("/orders")}
                    style={{
                      padding: "7px 16px", fontSize: 13, color: "#3E3E3E",
                      cursor: "pointer", display: "block", width: "100%",
                      textAlign: "left", background: "none", border: "none"
                    }}
                  >
                    My Orders
                  </button>

                  <button
                    className="gf-dropdown-item"
                    onClick={() => navigate("/profile")}
                    style={{
                      padding: "7px 16px", fontSize: 13, color: "#3E3E3E",
                      cursor: "pointer", display: "block", width: "100%",
                      textAlign: "left", background: "none", border: "none"
                    }}
                  >
                    Profile
                  </button>

                  <button
                    className="gf-dropdown-item"
                    onClick={() => { logout(); navigate("/"); }}
                    style={{
                      padding: "7px 16px", fontSize: 13, color: "#C0392B",
                      cursor: "pointer", display: "block", width: "100%",
                      textAlign: "left", background: "none", border: "none"
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile search */}
        <div className="p-4 md:hidden">
          <input
            placeholder="Search food..."
            style={{
              width: "100%", padding: "10px 16px",
              borderRadius: 24,
              border: "1.5px solid #D4A373",
              background: "#fff", fontSize: 14,
              color: "#3E3E3E", outline: "none"
            }}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, padding: "14px 24px" }}>
          <select
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "8px 14px", borderRadius: 20,
              border: "1.5px solid #D4A373",
              background: "#fff", color: "#3E3E3E",
              fontSize: 13, outline: "none", cursor: "pointer"
            }}
          >
            <option value="all">All</option>
            <option value="food">Food</option>
            <option value="drink">Drink</option>
          </select>

          <select
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: "8px 14px", borderRadius: 20,
              border: "1.5px solid #D4A373",
              background: "#fff", color: "#3E3E3E",
              fontSize: 13, outline: "none", cursor: "pointer"
            }}
          >
            <option value="">Sort</option>
            <option value="low">Price Low → High</option>
            <option value="high">Price High → Low</option>
          </select>
        </div>

        {/* Food grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          padding: "0 24px 24px"
        }}>
          {filtered.map(food => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>

      </div>
    </>
  );
}

export default Home;