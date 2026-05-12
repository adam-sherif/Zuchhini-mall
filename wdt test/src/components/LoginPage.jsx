import React, { useState } from "react";

const LOCATIONS = [
  "New York, USA","Los Angeles, USA","London, UK","Dubai, UAE",
  "Cairo, Egypt","Riyadh, Saudi Arabia","Paris, France","Tokyo, Japan",
  "Toronto, Canada","Sydney, Australia","Berlin, Germany","Singapore",
];

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [phone,    setPhone]    = useState("");
  const [location, setLocation] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  function validate() {
    if (!username.trim() || username.trim().length < 2) return "Username must be at least 2 characters.";
    if (!phone.trim() || !/^\+?[\d\s\-()]{6,}$/.test(phone.trim())) return "Enter a valid phone number.";
    if (!location) return "Please select your city.";
    return null;
  }

  function handleSubmit() {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ username: username.trim(), phone: phone.trim(), location }); }, 900);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7F4F0",
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch",
    }}>
      <style>{`
        @media (max-width: 768px) {
          .desktop-panel { display: none !important; }
          .login-form { width: 100% !important; max-width: 100% !important; box-shadow: none !important; }
        }
        @media (min-width: 769px) {
          .desktop-panel { display: flex !important; }
          .login-form { width: min(440px, 100%) !important; max-width: 100% !important; }
        }
      `}</style>

      {/* ── LEFT DECORATIVE PANEL (desktop only) ── */}
      <div className="desktop-panel" style={{
        flex: 1,
        background: "#4F46E5",
        display: "none",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 40px",
      }}>
        <div className="bebas" style={{
          fontSize: 60,
          color: "#fff",
          letterSpacing: 3,
          lineHeight: 1,
          marginBottom: 16,
          textAlign: "center",
        }}>
          ZUCCHINI<br />MALL
        </div>
        <p style={{
          color: "rgba(255,255,255,.7)",
          fontSize: 15,
          textAlign: "center",
          maxWidth: 280,
          lineHeight: 1.6,
          marginBottom: 40,
        }}>
          Access curated international brands and unlock verified vouchers with a single click.
        </p>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
          maxWidth: 260,
        }}>
          {[
            { icon: "🎫", label: "Earn discount coupons by playing games" },
            { icon: "🗺️", label: "Explore the interactive mall map" },
            { icon: "🛍️", label: "Shop 10 premium international brands" },
          ].map(f => (
            <div key={f.label} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,.1)",
              borderRadius: 10,
              padding: "10px 14px",
            }}>
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              <span style={{
                fontSize: 12,
                color: "rgba(255,255,255,.85)",
                fontWeight: 600,
                lineHeight: 1.4,
              }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOGIN FORM (responsive) ── */}
      <div className="login-form" style={{
        width: "min(440px,100%)",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px, 5vw, 48px)",
        boxShadow: "-4px 0 30px rgba(0,0,0,.08)",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 340 }}>
          {/* Logo */}
          <div style={{
            textAlign: "center",
            marginBottom: "clamp(20px, 4vw, 32px)",
          }}>
            <div className="bebas" style={{
              fontSize: "clamp(24px, 6vw, 32px)",
              color: "#4F46E5",
              letterSpacing: 2,
              marginBottom: 4,
            }}>
              ZUCCHINI MALL
            </div>
            <p style={{
              color: "#6B7280",
              fontSize: "clamp(11px, 2vw, 13px)",
              margin: 0,
            }}>
              Sign in to start shopping
            </p>
          </div>

          {/* Form Fields */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(12px, 3vw, 18px)",
          }}>
            <Field label="USERNAME">
              <input
                className="zm-input"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                autoComplete="username"
                style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}
              />
            </Field>

            <Field label="PHONE NUMBER">
              <input
                className="zm-input"
                placeholder="+1 (555) 000-0000"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                autoComplete="tel"
                style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}
              />
            </Field>

            <Field label="CITY / LOCATION">
              <select
                className="zm-input"
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}
              >
                <option value="">— Select your city —</option>
                {LOCATIONS.map(l => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>

            {error && (
              <div style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#DC2626",
                fontSize: "clamp(11px, 2vw, 12px)",
                fontWeight: 600,
                animation: "shake .3s ease",
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              className="zm-btn zm-btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "clamp(10px, 2vw, 14px)",
                fontSize: "clamp(12px, 2.5vw, 15px)",
                marginTop: "clamp(8px, 2vw, 16px)",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 16,
                    height: 16,
                    border: "2px solid #fff4",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }} />
                  Entering…
                </span>
              ) : "ENTER THE MALL →"}
            </button>
          </div>

          <p style={{
            textAlign: "center",
            fontSize: "clamp(9px, 1.5vw, 10px)",
            color: "#B8B0A6",
            marginTop: "clamp(16px, 3vw, 24px)",
            margin: "clamp(16px, 3vw, 24px) 0 0 0",
          }}>
            🔒 Demo app — no real data is stored.
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: "clamp(12px, 2vw, 16px)",
            flexWrap: "wrap",
          }}>
            {["👟", "👗", "☕", "📱", "💄", "🛋️", "🍔", "🏃"].map(e => (
              <span
                key={e}
                style={{
                  fontSize: "clamp(14px, 3vw, 18px)",
                  opacity: 0.4,
                  transition: "opacity .2s",
                  cursor: "default",
                }}
                onMouseEnter={ev => (ev.currentTarget.style.opacity = "1")}
                onMouseLeave={ev => (ev.currentTarget.style.opacity = ".4")}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{
        display: "block",
        fontSize: "clamp(9px, 1.5vw, 10px)",
        fontWeight: 800,
        color: "#6B7280",
        marginBottom: 6,
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}
