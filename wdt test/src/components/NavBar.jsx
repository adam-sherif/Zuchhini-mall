import React from "react";

export default function NavBar({
  view, user, search, setSearch,
  onHome, onMap, onPuzzle, onLogout, earnedDiscount,
}) {
  const NavLink = ({ id, label, onClick }) => (
    <button onClick={onClick} style={{
      background: "none",
      border: "none",
      color: view === id ? "#4F46E5" : "#1C1C2E",
      fontFamily: "'DM Sans',sans-serif",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      padding: "0 14px",
      height: "100%",
      borderBottom: view === id ? "2px solid #4F46E5" : "2px solid transparent",
      transition: "all .15s",
      whiteSpace: "nowrap",
      letterSpacing: "0.3px",
    }}
    onMouseEnter={e => { if (view !== id) e.currentTarget.style.color = "#4F46E5"; }}
    onMouseLeave={e => { if (view !== id) e.currentTarget.style.color = "#1C1C2E"; }}>
      {label}
    </button>
  );

  return (
    <>
      <style>{`
        @media(max-width:480px){.hide-xs{display:none!important;}}
        @media(max-width:640px){.hide-sm{display:none!important;}}
      `}</style>
      <header style={{
        height: 58,
        background: "#fff",
        borderBottom: "1px solid #E8E2DB",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 300,
        boxShadow: "0 1px 8px rgba(0,0,0,.06)",
      }}>
        <button onClick={onHome} style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
          marginRight: 8,
        }}>
          <span className="bebas" style={{ fontSize: 26, color: "#4F46E5", letterSpacing: 2 }}>
            ZUCCHINI
          </span>
        </button>

        <nav style={{
          display: "flex",
          alignItems: "stretch",
          height: "100%",
          gap: 0,
        }}>
          <NavLink id="home" label="HOME" onClick={onHome} />
          <NavLink id="map" label="ZUCCHINI MAP" onClick={onMap} />
          <NavLink id="puzzle" label="GAMES & COUPONS" onClick={onPuzzle} />
        </nav>

        <div className="hide-sm" style={{
          flex: 1,
          maxWidth: 240,
          position: "relative",
          marginLeft: 8,
        }}>
          <span style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 13,
            color: "#B8B0A6",
          }}>
            🔍
          </span>
          <input
            className="zm-input"
            placeholder="Search stores…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              paddingLeft: 34,
              height: 34,
              fontSize: 12,
              borderRadius: 50,
            }}
          />
        </div>

        <div style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}>
          {earnedDiscount > 0 && (
            <div style={{
              background: "#FF5733",
              color: "#fff",
              borderRadius: 50,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 800,
            }}>
              🎫 {earnedDiscount}% OFF
            </div>
          )}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: "#fff",
            }}>
              {user.username?.[0]?.toUpperCase() || "?"}
            </div>
            <span className="hide-sm" style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6B7280",
              maxWidth: 80,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {user.username}
            </span>
          </div>
          <button onClick={onLogout} style={{
            background: "#4F46E5",
            border: "none",
            borderRadius: 50,
            padding: "7px 16px",
            color: "#fff",
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#3D35C8"}
          onMouseLeave={e => e.currentTarget.style.background = "#4F46E5"}>
            LOGOUT
          </button>
        </div>
      </header>
    </>
  );
}
