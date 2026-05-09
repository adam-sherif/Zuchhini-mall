import React, { useState, useCallback, useRef, useEffect } from "react";
import { STORES, CATEGORIES, genOrderId } from "./data.js";
import NavBar from "./components/NavBar.jsx";
import LoginPage from "./components/LoginPage.jsx";
import HomePage from "./components/HomePage.jsx";
import MapView from "./components/MapView.jsx";
import PuzzleView from "./components/PuzzleView.jsx";
import StoreModal from "./components/StoreModal.jsx";

// ── GLOBAL CSS ──────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#F7F4F0;color:#1C1C2E;font-family:'DM Sans',sans-serif;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}

::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:#EDE8E1;}
::-webkit-scrollbar-thumb{background:#C8C0B5;border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:#A89D90;}

/* ── DESIGN TOKENS ─────────────────────────────
   Purple primary : #4F46E5
   Orange accent  : #FF5733
   Cream bg       : #F7F4F0
   White card     : #FFFFFF
   Dark text      : #1C1C2E
   Muted text     : #6B7280
   Border         : #E2DBD2
─────────────────────────────────────────────── */

.bebas{font-family:'Bebas Neue',sans-serif;letter-spacing:1px;}
.mono{font-family:'JetBrains Mono',monospace;}

@keyframes fadeIn    {from{opacity:0}to{opacity:1}}
@keyframes slideUp   {from{transform:translateY(22px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideInR  {from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes popIn     {from{transform:scale(.88);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes shake     {0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes floatY    {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes bubbleIn  {from{transform:scale(.7) translateY(10px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
@keyframes cardFlip  {from{transform:rotateY(90deg);opacity:.4}to{transform:rotateY(0deg);opacity:1}}
@keyframes checkDraw {from{stroke-dashoffset:60}to{stroke-dashoffset:0}}
@keyframes toastIn   {from{transform:translateX(110%)}to{transform:translateX(0)}}
@keyframes pulse     {0%,100%{opacity:1}50%{opacity:.4}}
@keyframes timerPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes glowP     {0%,100%{filter:drop-shadow(0 0 4px #4F46E5)}50%{filter:drop-shadow(0 0 12px #4F46E5)}}
@keyframes spin      {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

.zm-btn{font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;border:none;border-radius:50px;transition:all .18s;outline:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 22px;font-size:14px;}
.zm-btn:disabled{opacity:.45;cursor:not-allowed;}
.zm-btn:active:not(:disabled){transform:scale(.96);}

.zm-btn-primary{background:#4F46E5;color:#fff;}
.zm-btn-primary:hover:not(:disabled){background:#3D35C8;box-shadow:0 6px 24px rgba(79,70,229,.35);transform:translateY(-1px);}
.zm-btn-accent{background:#FF5733;color:#fff;}
.zm-btn-accent:hover:not(:disabled){background:#E0441F;box-shadow:0 6px 24px rgba(255,87,51,.35);transform:translateY(-1px);}
.zm-btn-gold{background:#F59E0B;color:#1C1C2E;}
.zm-btn-gold:hover:not(:disabled){background:#D97706;box-shadow:0 6px 24px rgba(245,158,11,.35);transform:translateY(-1px);}
.zm-btn-ghost{background:transparent;border:1.5px solid #1C1C2E;color:#1C1C2E;border-radius:50px;}
.zm-btn-ghost:hover:not(:disabled){background:#1C1C2E;color:#fff;}
.zm-btn-success{background:#22C55E;color:#fff;}
.zm-btn-success:hover:not(:disabled){background:#16A34A;box-shadow:0 6px 24px rgba(34,197,94,.35);transform:translateY(-1px);}
.zm-btn-danger{background:#EF4444;color:#fff;}
.zm-btn-danger:hover:not(:disabled){background:#DC2626;transform:translateY(-1px);}

.zm-input{width:100%;padding:12px 16px;background:#fff;border:1.5px solid #E2DBD2;border-radius:10px;color:#1C1C2E;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;outline:none;transition:border-color .18s;}
.zm-input:focus{border-color:#4F46E5;box-shadow:0 0 0 3px rgba(79,70,229,.1);}
.zm-input::placeholder{color:#B8B0A6;}
select.zm-input{background:#fff;}

.zm-card{background:#fff;border:1px solid #E8E2DB;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.06);}
.zm-overlay{position:fixed;inset:0;z-index:500;background:rgba(28,28,46,.55);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn .2s ease;}
`;

function StyleInjector() {
  useEffect(() => {
    const id = "zm-global-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);
  return null;
}

// ── TOAST ──────────────────────────────────────
function Toast({ msg, type }) {
  const bg = type === "success" ? "#22C55E" : type === "error" ? "#EF4444" : "#4F46E5";
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 900,
      background: bg, color: "#fff", padding: "12px 20px",
      borderRadius: 50, fontWeight: 700, fontSize: 13,
      boxShadow: "0 8px 30px rgba(0,0,0,.2)",
      animation: "toastIn .3s ease",
      maxWidth: 340, fontFamily: "'DM Sans',sans-serif",
    }}>
      {msg}
    </div>
  );
}

// ── APP ────────────────────────────────────────
export default function App() {
  const [user,           setUser]           = useState(null);
  const [view,           setView]           = useState("home");   // home | map | puzzle
  const [earnedDiscount, setEarnedDiscount] = useState(0);
  const [selectedStore,  setSelectedStore]  = useState(null);
  const [search,         setSearch]         = useState("");
  const [activeCat,      setActiveCat]      = useState("all");
  const [toast,          setToast]          = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = "info") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handlePlayGame = useCallback((gameType, storeId, discount) => {
    // Navigate to the puzzle/game view with the specific game
    // The PuzzleView will handle the actual game logic
    setSelectedStore(null);
    setView("puzzle");
    showToast(`🎮 Loading ${gameType} game...`, "info");
  }, [showToast]);

  if (!user) return (
    <>
      <StyleInjector />
      <LoginPage onLogin={u => { setUser(u); setView("home"); }} />
    </>
  );

  return (
    <>
      <StyleInjector />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NavBar
          view={view}
          user={user}
          search={search}
          setSearch={setSearch}
          onHome={() => setView("home")}
          onMap={() => setView("map")}
          onPuzzle={() => setView("puzzle")}
          onLogout={() => { setUser(null); setEarnedDiscount(0); setView("home"); }}
          earnedDiscount={earnedDiscount}
        />
        <main style={{ flex: 1 }}>
          {view === "home" && (
            <HomePage
              stores={STORES}
              cats={CATEGORIES}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
              search={search}
              onOpenStore={setSelectedStore}
              onEnterMap={() => setView("map")}
              onPuzzle={() => setView("puzzle")}
              earnedDiscount={earnedDiscount}
            />
          )}
          {view === "map" && (
            <MapView
              stores={STORES}
              onEnterStore={setSelectedStore}
              earnedDiscount={earnedDiscount}
            />
          )}
          {view === "puzzle" && (
            <PuzzleView
              onWin={discount => {
                setEarnedDiscount(discount);
                showToast(`🎉 You earned ${discount}% off!`, "success");
                setTimeout(() => setView("home"), 2000);
              }}
              onBack={() => setView("home")}
              currentDiscount={earnedDiscount}
            />
          )}
        </main>
      </div>

      {selectedStore && (
        <StoreModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
          onPlayGame={handlePlayGame}
        />
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}
