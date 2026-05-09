import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MAP_W, MAP_H, SW, SH, LR, CR, SPD, TRIG,
  STORES, storeCenter, isBlocked,
} from "../data.js";

// ── CORRIDOR CONSTANTS ──────────────────────────
export const VX1 = 380;
export const VX2 = 520;
export const HY1 = 280;
export const HY2 = 420;

// ── DISTRICT ZONES ─────────────────────────────
const DISTRICTS = [
  { label: "FASHION\nDISTRICT", x: 90,  y: 140, color: "#FF4B6E" },
  { label: "TECH\nQUARTER",     x: 660, y: 140, color: "#0DCFB4" },
  { label: "FOOD\nQUARTER",     x: 90,  y: 530, color: "#F0A500" },
  { label: "BEAUTY\nQUARTER",   x: 660, y: 530, color: "#A855F7" },
];

// ── STORE POSITIONS (structured grid layout) ────
const STORE_POSITIONS = {
  1:  { x: 30,  y: 180 },
  2:  { x: 240, y: 30  },
  3:  { x: 550, y: 30  },
  4:  { x: 760, y: 180 },
  5:  { x: 30,  y: 420 },
  6:  { x: 760, y: 420 },
  7:  { x: 240, y: 580 },
  8:  { x: 550, y: 580 },
  9:  { x: 30,  y: 540 },
  10: { x: 760, y: 540 },
};

// ── PLAYER SPRITE ──────────────────────────────
function PlayerSprite({ x, y, moving }) {
  const anim = moving ? "none" : "glowP 2.5s ease-in-out infinite";
  return (
    <g style={{ transformOrigin: `${x}px ${y}px`, animation: anim }}>
      <circle cx={x} cy={y} r={CR + 5} fill="rgba(79,70,229,.15)" />
      <circle cx={x} cy={y - 14} r={6} fill="#4F46E5" />
      <circle cx={x - 2} cy={y - 15} r={1.2} fill="#fff" />
      <circle cx={x + 2} cy={y - 15} r={1.2} fill="#fff" />
      <line x1={x} y1={y - 8} x2={x} y2={y + 5} stroke="#4F46E5" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={x - 7} y1={y - 4} x2={x + 7} y2={y - 4} stroke="#4F46E5" strokeWidth={2} strokeLinecap="round" />
      <line x1={x} y1={y + 5} x2={x - 5} y2={y + 14} stroke="#4F46E5" strokeWidth={2} strokeLinecap="round" />
      <line x1={x} y1={y + 5} x2={x + 5} y2={y + 14} stroke="#4F46E5" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

// ── THOUGHT BUBBLE ────────────────────────────
function ThoughtBubble({ px, py, store, earnedDiscount, onEnter }) {
  const BW = 165, BH = 68;
  const bx = Math.min(Math.max(px - BW / 2, 10), 900 - BW - 10);
  const by = Math.max(py - 105, 10);
  return (
    <g style={{ animation: "bubbleIn .22s cubic-bezier(.34,1.4,.64,1)" }}>
      <circle cx={px}   cy={py - 24} r={2.5} fill="#4F46E5" opacity={0.5} />
      <circle cx={px+2} cy={py - 35} r={3.5} fill="#4F46E5" opacity={0.65} />
      <circle cx={px+4} cy={py - 48} r={5}   fill="#4F46E5" opacity={0.8} />
      <rect x={bx} y={by} width={BW} height={BH} rx={14}
        fill="#fff" stroke="#E2DBD2" strokeWidth={1.5}
        filter="url(#bubbleShadow)" />
      <text x={bx+12} y={by+20} fontSize={13} fontWeight="800"
        fontFamily="'Bebas Neue',sans-serif" fill="#1C1C2E" letterSpacing="1">
        {store.emoji} {store.name.toUpperCase()}
      </text>
      {earnedDiscount > 0
        ? <text x={bx+12} y={by+38} fontSize={10.5} fill="#16A34A" fontWeight="700"
            fontFamily="'DM Sans',sans-serif">🎫 {earnedDiscount}% Coupon!</text>
        : <text x={bx+12} y={by+38} fontSize={10.5} fill="#6B7280"
            fontFamily="'DM Sans',sans-serif">🎮 Play games for discount</text>
      }
      <text x={bx+12} y={by+54} fontSize={9.5} fill="#B8B0A6"
        fontFamily="'DM Sans',sans-serif" fontStyle="italic">Press E or tap Visit →</text>
      <rect x={bx+BW-52} y={by+BH-26} width={44} height={20} rx={10}
        fill="#4F46E5" style={{ cursor: "pointer" }} onClick={onEnter} />
      <text x={bx+BW-30} y={by+BH-12} fontSize={9} fill="#fff"
        fontWeight="800" textAnchor="middle"
        style={{ cursor: "pointer", userSelect: "none" }} onClick={onEnter}>Visit →</text>
    </g>
  );
}

// ── STORE BLOCK (clickable hyperlink) ──────────
function StoreBlock({ store, isNear }) {
  const pos = STORE_POSITIONS[store.id] || { x: store.x, y: store.y };
  const px = pos.x, py = pos.y;

  return (
    <g>
      {isNear && (
        <rect x={px - 5} y={py - 5} width={SW + 10} height={SH + 10} rx={12}
          fill="none" stroke="#4F46E5" strokeWidth={2} opacity={0.45}
          style={{ animation: "pulse 1s ease-in-out infinite" }} />
      )}

      {/* Clickable hyperlink wrapper */}
      <a href={store.url} target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer" }}>
        <rect x={px} y={py} width={SW} height={SH} rx={9}
          fill="#FFF8F0"
          stroke={isNear ? "#4F46E5" : "#D9CFC4"}
          strokeWidth={isNear ? 2 : 1.2}
          style={{ transition: "all .2s" }} />

        {/* Top color accent bar */}
        <rect x={px} y={py} width={SW} height={6} rx={9} fill={store.color} opacity={0.85} />
        <rect x={px} y={py + 3} width={SW} height={3} fill={store.color} opacity={0.85} />

        {/* Logo circle */}
        <circle cx={px + SW / 2} cy={py + SH / 2 - 4} r={LR + 2}
          fill={`${store.color}20`} stroke={store.color} strokeWidth={1.5} />
        <text x={px + SW / 2} y={py + SH / 2 - 4}
          textAnchor="middle" dominantBaseline="middle" fontSize={20}>
          {store.emoji}
        </text>

        {/* Hyperlink indicator badge */}
        <circle cx={px + SW - 12} cy={py + 12} r={9}
          fill="#FF5733" opacity={0.9} />
        <text x={px + SW - 12} y={py + 15}
          textAnchor="middle" dominantBaseline="middle" fontSize={12} fill="#fff">
          🔗
        </text>

        {/* Store name label */}
        <text x={px + SW / 2} y={py + SH - 10}
          textAnchor="middle" fontSize={9.5} fontWeight="800"
          fill={isNear ? "#4F46E5" : "#4B4540"}
          fontFamily="'DM Sans',sans-serif" letterSpacing="0.5">
          {store.name.toUpperCase()}
        </text>
      </a>
    </g>
  );
}

// ── D-PAD BUTTON ──────────────────────────────
function DPadBtn({ label, onStart, onStop }) {
  return (
    <button onPointerDown={onStart} onPointerUp={onStop} onPointerLeave={onStop} style={{
      width: 44, height: 44, background: "#fff", border: "1.5px solid #E2DBD2",
      borderRadius: 8, color: "#4F46E5", fontSize: 18, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      userSelect: "none", WebkitUserSelect: "none", touchAction: "none",
    }}>{label}</button>
  );
}

// ── MAP VIEW (fully responsive) ───────────────
export default function MapView({ stores, onEnterStore, earnedDiscount }) {
  const startX = (VX1 + VX2) / 2;
  const startY = (HY1 + HY2) / 2;

  const keysRef    = useRef({});
  const posRef     = useRef({ x: startX, y: startY });
  const movingRef  = useRef(false);
  const [pos,       setPos]       = useState({ x: startX, y: startY });
  const [moving,    setMoving]    = useState(false);
  const [nearStore, setNearStore] = useState(null);

  const getCenter = (s) => {
    const p = STORE_POSITIONS[s.id] || { x: s.x, y: s.y };
    return [p.x + SW / 2, p.y + SH / 2];
  };

  useEffect(() => {
    const down = e => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (["arrowup","arrowdown","arrowleft","arrowright"].includes(e.key.toLowerCase()))
        e.preventDefault();
    };
    const up = e => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useEffect(() => {
    let rafId;
    function tick() {
      const k = keysRef.current;
      let { x, y } = posRef.current;
      let moved = false;
      if (k["w"] || k["arrowup"])    { const ny = y - SPD; if (!isBlocked(x, ny)) { y = ny; moved = true; } }
      if (k["s"] || k["arrowdown"])  { const ny = y + SPD; if (!isBlocked(x, ny)) { y = ny; moved = true; } }
      if (k["a"] || k["arrowleft"])  { const nx = x - SPD; if (!isBlocked(nx, y)) { x = nx; moved = true; } }
      if (k["d"] || k["arrowright"]) { const nx = x + SPD; if (!isBlocked(nx, y)) { x = nx; moved = true; } }
      if (moved) {
        posRef.current = { x, y };
        setPos({ x, y });
        if (!movingRef.current) { movingRef.current = true; setMoving(true); }
      } else {
        if (movingRef.current) { movingRef.current = false; setMoving(false); }
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    let near = null;
    for (const s of stores) {
      const [cx, cy] = getCenter(s);
      if (Math.hypot(pos.x - cx, pos.y - cy) < TRIG) { near = s; break; }
    }
    setNearStore(prev => (prev?.id === near?.id ? prev : near));
  }, [pos, stores]);

  useEffect(() => {
    const fn = e => { if ((e.key === "e" || e.key === "E") && nearStore) onEnterStore(nearStore); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [nearStore, onEnterStore]);

  const pressKey   = useCallback(k => { keysRef.current[k] = true;  }, []);
  const releaseKey = useCallback(k => { keysRef.current[k] = false; }, []);

  return (
    <div style={{ background: "#F7F4F0", minHeight: "calc(100vh - 58px)", display: "flex", flexDirection: "column" }}>

      {/* ── INFO BAR ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E8E2DB",
        padding: "8px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        fontSize: "clamp(11px, 2vw, 13px)",
      }}>
        <span style={{ fontWeight: 600, color: "#6B7280" }}>
          🗺️ <b>Zucchini Mall</b> — <span style={{ color: "#4F46E5" }}>WASD/Arrows</span> · <span style={{ color: "#FF5733" }}>E</span> to visit
        </span>
        {earnedDiscount > 0 && (
          <div style={{
            marginLeft: "auto", background: "rgba(79,70,229,.08)",
            border: "1px solid rgba(79,70,229,.2)", borderRadius: 50,
            padding: "4px 12px", fontSize: "clamp(10px, 1.5vw, 12px)", fontWeight: 800, color: "#4F46E5",
          }}>🎫 {earnedDiscount}% OFF</div>
        )}
        {nearStore && (
          <div style={{
            background: "rgba(255,87,51,.08)", border: "1px solid rgba(255,87,51,.2)",
            borderRadius: 50, padding: "4px 12px",
            fontSize: "clamp(10px, 1.5vw, 12px)", fontWeight: 800, color: "#FF5733",
            animation: "pulse 1s ease-in-out infinite",
          }}>📍 {nearStore.emoji} {nearStore.name}</div>
        )}
      </div>

      {/* ── MAP AREA (fully responsive) ── */}
      <div style={{
        flex: 1, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start",
        padding: "clamp(8px, 3vw, 24px)",
      }}>
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            borderRadius: 16,
            boxShadow: "0 4px 30px rgba(0,0,0,.1)",
            border: "1px solid #D9CFC4",
            aspectRatio: `${MAP_W}/${MAP_H}`,
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="bubbleShadow">
              <feDropShadow dx={0} dy={3} stdDeviation={5} floodColor="#000" floodOpacity={0.12} />
            </filter>
            <pattern id="floorTile" width={40} height={40} patternUnits="userSpaceOnUse">
              <rect width={40} height={40} fill="#F0EBE1" />
              <path d="M0 20 L40 20 M20 0 L20 40" stroke="#E8E0D3" strokeWidth={0.6} />
            </pattern>
            <pattern id="corridorTile" width={30} height={30} patternUnits="userSpaceOnUse">
              <rect width={30} height={30} fill="#FAF8F4" />
              <rect width={14} height={14} fill="#F5F1EC" rx={1} />
              <rect x={15} y={15} width={14} height={14} fill="#F5F1EC" rx={1} />
            </pattern>
            <radialGradient id="atriumGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#F9C84E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#F9C84E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── BACKGROUND ── */}
          <rect width={MAP_W} height={MAP_H} fill="url(#floorTile)" />

          {/* ── DISTRICT CORNER ZONES ── */}
          <rect x={0}    y={0}    width={VX1}       height={HY1} fill="#FF4B6E08" />
          <rect x={VX2}  y={0}    width={MAP_W-VX2} height={HY1} fill="#0DCFB408" />
          <rect x={0}    y={HY2}  width={VX1}       height={MAP_H-HY2} fill="#F0A50008" />
          <rect x={VX2}  y={HY2}  width={MAP_W-VX2} height={MAP_H-HY2} fill="#A855F708" />

          {/* ── CORRIDORS ── */}
          <rect x={0} y={HY1} width={MAP_W} height={HY2 - HY1} fill="url(#corridorTile)" />
          <rect x={0} y={HY1} width={MAP_W} height={3} fill="#D9CFC4" opacity={0.5} />
          <rect x={0} y={HY2 - 3} width={MAP_W} height={3} fill="#D9CFC4" opacity={0.5} />
          <line x1={0} y1={HY1} x2={MAP_W} y2={HY1} stroke="#C8C0B5" strokeWidth={1.2} />
          <line x1={0} y1={HY2} x2={MAP_W} y2={HY2} stroke="#C8C0B5" strokeWidth={1.2} />

          <rect x={VX1} y={0} width={VX2 - VX1} height={MAP_H} fill="url(#corridorTile)" />
          <rect x={VX1} y={0} width={3} height={MAP_H} fill="#D9CFC4" opacity={0.5} />
          <rect x={VX2 - 3} y={0} width={3} height={MAP_H} fill="#D9CFC4" opacity={0.5} />
          <line x1={VX1} y1={0} x2={VX1} y2={MAP_H} stroke="#C8C0B5" strokeWidth={1.2} />
          <line x1={VX2} y1={0} x2={VX2} y2={MAP_H} stroke="#C8C0B5" strokeWidth={1.2} />

          {/* ── ATRIUM ── */}
          <rect x={VX1} y={HY1} width={VX2 - VX1} height={HY2 - HY1} fill="url(#atriumGlow)" />
          <rect x={VX1 + 6} y={HY1 + 6} width={VX2 - VX1 - 12} height={HY2 - HY1 - 12}
            rx={6} fill="none" stroke="#F9C84E" strokeWidth={1.2} strokeDasharray="5,4" opacity={0.6} />
          <text x={(VX1 + VX2) / 2} y={(HY1 + HY2) / 2 - 8}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill="#B89A3080" fontFamily="'DM Sans',sans-serif"
            fontWeight="800" letterSpacing="3">ATRIUM</text>

          {/* ── DISTRICT LABELS ── */}
          {DISTRICTS.map(d => {
            const lines = d.label.split("\n");
            return (
              <g key={d.label}>
                <circle cx={d.x} cy={d.y - 18} r={5} fill={d.color} opacity={0.7} />
                {lines.map((line, i) => (
                  <text key={i} x={d.x} y={d.y + i * 14}
                    textAnchor="middle"
                    fontSize={11} fontWeight="800"
                    fill={d.color}
                    fontFamily="'DM Sans',sans-serif"
                    opacity={0.55}
                    letterSpacing="0.8">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* ── MALL SIGN DOTS ── */}
          {[120, 300, 600, 780].map(x => (
            <circle key={x} cx={x} cy={(HY1 + HY2) / 2} r={3} fill="#D9CFC4" opacity={0.6} />
          ))}
          {[80, 200, 500, 620].map(y => (
            <circle key={y} cx={(VX1 + VX2) / 2} cy={y} r={3} fill="#D9CFC4" opacity={0.6} />
          ))}

          {/* ── STORES ── */}
          {stores.map(s => <StoreBlock key={s.id} store={s} isNear={nearStore?.id === s.id} />)}

          {/* ── PLAYER ── */}
          <PlayerSprite x={pos.x} y={pos.y} moving={moving} />

          {/* ── THOUGHT BUBBLE ── */}
          {nearStore && (
            <ThoughtBubble
              px={pos.x} py={pos.y}
              store={nearStore}
              earnedDiscount={earnedDiscount}
              onEnter={() => onEnterStore(nearStore)}
            />
          )}

          {/* ── COMPASS ── */}
          <g transform={`translate(${MAP_W - 44}, 38)`}>
            <circle cx={0} cy={0} r={22} fill="#FFF8F0" stroke="#D9CFC4" strokeWidth={1.2} />
            <text x={0} y={-8}  textAnchor="middle" fontSize={8} fill="#4F46E5" fontWeight="800">N</text>
            <text x={0} y={13}  textAnchor="middle" fontSize={8} fill="#B8B0A6" fontWeight="700">S</text>
            <text x={-12} y={4} textAnchor="middle" fontSize={8} fill="#B8B0A6" fontWeight="700">W</text>
            <text x={12}  y={4} textAnchor="middle" fontSize={8} fill="#B8B0A6" fontWeight="700">E</text>
            <polygon points="0,-14 3,-4 0,-7 -3,-4" fill="#4F46E5" />
            <polygon points="0,14 3,4 0,7 -3,4" fill="#B8B0A6" />
          </g>

          {/* ── LEGEND ── */}
          <g transform="translate(14, 14)">
            <rect width={108} height={70} rx={8}
              fill="#FFF8F0" stroke="#D9CFC4" strokeWidth={1} opacity={0.95} />
            <text x={8} y={16} fontSize={8.5} fontWeight="800"
              fill="#4B4540" fontFamily="'DM Sans',sans-serif" letterSpacing="0.5">DISTRICTS</text>
            {[
              ["#FF4B6E", "Fashion"],
              ["#0DCFB4", "Tech"],
              ["#F0A500", "Food"],
              ["#A855F7", "Beauty"],
            ].map(([color, label], i) => (
              <g key={label} transform={`translate(8, ${26 + i * 11})`}>
                <circle cx={4} cy={4} r={4} fill={color} opacity={0.8} />
                <text x={12} y={8} fontSize={8} fill="#6B7280"
                  fontFamily="'DM Sans',sans-serif">{label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* ── MOBILE D-PAD ── */}
      <div style={{
        padding: "clamp(8px, 2vw, 16px)", background: "#fff",
        borderTop: "1px solid #E8E2DB",
        display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
        flexWrap: "wrap",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "44px 44px 44px",
          gridTemplateRows: "44px 44px",
          gap: 4,
        }}>
          <div />
          <DPadBtn label="▲" onStart={() => pressKey("arrowup")}    onStop={() => releaseKey("arrowup")} />
          <div />
          <DPadBtn label="◀" onStart={() => pressKey("arrowleft")}  onStop={() => releaseKey("arrowleft")} />
          <DPadBtn label="▼" onStart={() => pressKey("arrowdown")}  onStop={() => releaseKey("arrowdown")} />
          <DPadBtn label="▶" onStart={() => pressKey("arrowright")} onStop={() => releaseKey("arrowright")} />
        </div>
        {nearStore && (
          <button
            onClick={() => onEnterStore(nearStore)}
            style={{
              marginLeft: 12, padding: "10px 18px",
              background: "#4F46E5", color: "#fff",
              border: "none", borderRadius: 10,
              fontWeight: 800, fontSize: "clamp(12px, 2vw, 14px)", cursor: "pointer",
            }}>
            Visit {nearStore.emoji}
          </button>
        )}
      </div>
    </div>
  );
}
