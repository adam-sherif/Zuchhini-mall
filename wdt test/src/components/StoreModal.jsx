import React, { useEffect, useState } from "react";

export default function StoreModal({ store, onClose, onPlayGame }) {
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="zm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#fff",
        border: "1px solid #E2DBD2",
        borderTop: `4px solid ${store.color}`,
        borderRadius: 16,
        width: "min(540px,100%)",
        maxHeight: "88vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animation: "popIn .35s cubic-bezier(.34,1.3,.64,1)",
        boxShadow: "0 20px 60px rgba(0,0,0,.15)",
      }}>
        {/* ── HEADER ── */}
        <div style={{
          padding: "20px 22px 16px",
          borderBottom: "1px solid #E8E2DB",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexShrink: 0,
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            background: `${store.color}15`,
            border: `1.5px solid ${store.color}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
          }}>
            {store.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div className="bebas" style={{ fontSize: 22, letterSpacing: 1, color: "#1C1C2E" }}>
              {store.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
              <span style={{
                background: `${store.color}15`,
                border: `1px solid ${store.color}33`,
                borderRadius: 50,
                padding: "2px 10px",
                fontSize: 10,
                fontWeight: 700,
                color: store.color,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                {store.cat}
              </span>
              <a href={store.url} target="_blank" rel="noopener noreferrer"
                style={{
                  fontSize: 10,
                  color: "#B8B0A6",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#4F46E5"}
                onMouseLeave={e => e.currentTarget.style.color = "#B8B0A6"}>
                🔗 Official Site
              </a>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            width: 32,
            height: 32,
            color: "#EF4444",
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#FEE2E2"}
          onMouseLeave={e => e.currentTarget.style.background = "#FEF2F2"}>
            ✕
          </button>
        </div>

        {/* ── CONTENT AREA ── */}
        <div style={{ overflowY: "auto", flex: 1, padding: "20px 22px" }}>
          
          {/* ── GAMES SECTION ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#1C1C2E",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "0.5px",
            }}>
              🎮 PLAY GAMES & EARN COUPONS
            </div>
            <p style={{
              fontSize: 12,
              color: "#6B7280",
              marginBottom: 14,
              lineHeight: 1.5,
            }}>
              Play our interactive games to unlock discount coupons for {store.name}. More games = bigger discounts!
            </p>

            {/* Game cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Memory Game */}
              <div style={{
                background: "#F7F4F0",
                border: "1px solid #E8E2DB",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "border-color .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#C8C0B5"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#E8E2DB"}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#E0C4FF",
                  border: "1px solid #C9A4FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  🧠
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C2E", marginBottom: 2 }}>
                    Memory Match
                  </div>
                  <div style={{ fontSize: 11, color: "#B8B0A6" }}>
                    Flip cards and find matching pairs
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{
                      fontSize: 10,
                      background: "rgba(168,85,247,.1)",
                      color: "#A855F7",
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontWeight: 700,
                    }}>
                      5% OFF
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onPlayGame("memory", store.id, 5)}
                  className="zm-btn zm-btn-primary"
                  style={{ padding: "8px 16px", fontSize: 12, flexShrink: 0 }}>
                  Play →
                </button>
              </div>

              {/* Quiz Game */}
              <div style={{
                background: "#F7F4F0",
                border: "1px solid #E8E2DB",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "border-color .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#C8C0B5"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#E8E2DB"}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#FBBF24",
                  border: "1px solid #FCA311",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  🧩
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C2E", marginBottom: 2 }}>
                    Quick Quiz
                  </div>
                  <div style={{ fontSize: 11, color: "#B8B0A6" }}>
                    Answer retail & shopping trivia
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{
                      fontSize: 10,
                      background: "rgba(245,158,11,.1)",
                      color: "#F59E0B",
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontWeight: 700,
                    }}>
                      10% OFF
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onPlayGame("quiz", store.id, 10)}
                  className="zm-btn zm-btn-primary"
                  style={{ padding: "8px 16px", fontSize: 12, flexShrink: 0 }}>
                  Play →
                </button>
              </div>

              {/* Spin-to-Win */}
              <div style={{
                background: "#F7F4F0",
                border: "1px solid #E8E2DB",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "border-color .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#C8C0B5"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#E8E2DB"}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#EC4899",
                  border: "1px solid #DB2777",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  🎡
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C2E", marginBottom: 2 }}>
                    Spin the Wheel
                  </div>
                  <div style={{ fontSize: 11, color: "#B8B0A6" }}>
                    Spin for a random discount prize
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{
                      fontSize: 10,
                      background: "rgba(236,72,153,.1)",
                      color: "#EC4899",
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontWeight: 700,
                    }}>
                      UP TO 15% OFF
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onPlayGame("spin", store.id, 15)}
                  className="zm-btn zm-btn-primary"
                  style={{ padding: "8px 16px", fontSize: 12, flexShrink: 0 }}>
                  Play →
                </button>
              </div>
            </div>
          </div>

          {/* ── COUPONS SECTION ── */}
          <div>
            <div style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#1C1C2E",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "0.5px",
            }}>
              🎫 AVAILABLE COUPONS
            </div>
            <div style={{
              background: "rgba(34,197,94,.05)",
              border: "1px solid rgba(34,197,94,.15)",
              borderRadius: 10,
              padding: "12px 14px",
            }}>
              <p style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>
                🎉 Win games to unlock daily coupons and exclusive {store.name} deals!
              </p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          padding: "14px 22px",
          borderTop: "1px solid #E8E2DB",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
          flexShrink: 0,
          background: "#F7F4F0",
        }}>
          <button
            className="zm-btn zm-btn-ghost"
            onClick={onClose}
            style={{ padding: "8px 18px", fontSize: 12 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
