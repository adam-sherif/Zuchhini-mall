import React, { useMemo } from "react";

export default function HomePage({
  stores, cats, activeCat, setActiveCat, search,
  onOpenStore, onEnterMap, onPuzzle, earnedDiscount,
}) {
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter(s => {
      const matchCat  = activeCat === "all" || s.cat === activeCat;
      const matchName = !q || s.name.toLowerCase().includes(q) ||
        s.products.some(p => p.name.toLowerCase().includes(q));
      return matchCat && matchName;
    });
  }, [stores, activeCat, search]);

  return (
    <div>
      {/* ── HERO ── */}
      <div style={{
        background:"#F7F4F0", padding:"80px 24px 64px",
        textAlign:"center", borderBottom:"1px solid #E8E2DB",
      }}>
        <p style={{ fontSize:11, fontWeight:700, color:"#6B7280",
          letterSpacing:"3px", textTransform:"uppercase", marginBottom:16 }}>
          THE WORLD'S ELITE BRANDS
        </p>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(42px,8vw,80px)",
          letterSpacing:2, lineHeight:1.05, color:"#1C1C2E", marginBottom:0 }}>
          ELEVATE YOUR
        </h1>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(42px,8vw,80px)",
          letterSpacing:2, lineHeight:1.05, color:"#4F46E5", marginBottom:20 }}>
          RETAIL JOURNEY.
        </h1>
        <p style={{ fontSize:14, color:"#6B7280", maxWidth:420, margin:"0 auto 32px", lineHeight:1.6 }}>
          Access curated international brands and unlock verified vouchers with a single click. A seamless digital retail experience.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="zm-btn zm-btn-primary" onClick={onPuzzle}
            style={{ padding:"12px 28px", fontSize:14, fontWeight:800, letterSpacing:"0.5px" }}>
            BOOK CAMPAIGN
          </button>
          <button className="zm-btn zm-btn-ghost" onClick={onEnterMap}
            style={{ padding:"12px 28px", fontSize:14, fontWeight:800, letterSpacing:"0.5px" }}>
            MINI REWARDS
          </button>
        </div>
      </div>

      {/* ── FEATURED STORES ── */}
      <div style={{ padding:"48px 24px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between",
          marginBottom:24, flexWrap:"wrap", gap:8 }}>
          <div>
            <h2 className="bebas" style={{ fontSize:28, letterSpacing:2, color:"#1C1C2E" }}>
              FEATURED STORES
            </h2>
            <p style={{ fontSize:11, color:"#6B7280", fontWeight:600, letterSpacing:"1px",
              textTransform:"uppercase", marginTop:2 }}>
              CLICK TO VISIT ORIGINAL BRAND SITE
            </p>
          </div>
          {/* pagination dots style */}
          <div style={{ display:"flex", gap:6 }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:i===0?20:8, height:8, borderRadius:4,
                background:i===0?"#4F46E5":"#E2DBD2", transition:"all .2s" }}/>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:24, overflowX:"auto", paddingBottom:4 }}>
          {cats.map(c=>(
            <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{
              background: activeCat===c.id ? "#4F46E5" : "#fff",
              border: activeCat===c.id ? "1px solid #4F46E5" : "1px solid #E2DBD2",
              borderRadius:50, padding:"7px 16px",
              color: activeCat===c.id ? "#fff" : "#6B7280",
              fontFamily:"'DM Sans',sans-serif", fontWeight:700,
              fontSize:12, cursor:"pointer", whiteSpace:"nowrap",
              display:"flex", alignItems:"center", gap:5,
              transition:"all .15s",
            }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <p style={{ fontSize:11, color:"#B8B0A6", fontWeight:600, marginBottom:16 }}>
          {filtered.length} store{filtered.length!==1?"s":""} found{search?` for "${search}"`:""}
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"#B8B0A6" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🏪</div>
            <div className="bebas" style={{ fontSize:24, letterSpacing:2, marginBottom:6, color:"#6B7280" }}>NO STORES FOUND</div>
            <p style={{ fontSize:13 }}>Try a different category or search term</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
            {filtered.map(store=>(
              <StoreCard key={store.id} store={store} onClick={()=>onOpenStore(store)} earnedDiscount={earnedDiscount} />
            ))}
          </div>
        )}
      </div>

      {/* ── INFO CARDS ── */}
      <div style={{ background:"#EDE8E1", padding:"40px 24px", borderTop:"1px solid #E2DBD2" }}>
        <div style={{ maxWidth:700, margin:"0 auto", display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>

          {/* About card */}
          <div style={{ background:"#fff", borderRadius:16, display:"flex",
            overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
            <div style={{ background:"#4F46E5", width:70, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span className="bebas" style={{ color:"#fff", fontSize:13, letterSpacing:2,
                writingMode:"vertical-rl", transform:"rotate(180deg)" }}>ABOUT</span>
            </div>
            <div style={{ padding:"20px 18px" }}>
              <div className="bebas" style={{ fontSize:20, letterSpacing:1, color:"#1C1C2E", marginBottom:6 }}>
                ZUCCHINI MALL
              </div>
              <p style={{ fontSize:12, color:"#6B7280", lineHeight:1.6 }}>
                A digital bridge connecting you to international brands with exclusive, verified rewards.
              </p>
            </div>
          </div>

          {/* Redemption card */}
          <div style={{ background:"#fff", borderRadius:16, display:"flex",
            overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
            <div style={{ background:"#FF5733", width:70, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span className="bebas" style={{ color:"#fff", fontSize:13, letterSpacing:2,
                writingMode:"vertical-rl", transform:"rotate(180deg)" }}>HELP</span>
            </div>
            <div style={{ padding:"20px 18px" }}>
              <div className="bebas" style={{ fontSize:20, letterSpacing:1, color:"#1C1C2E", marginBottom:6 }}>
                REDEMPTION
              </div>
              <p style={{ fontSize:12, color:"#6B7280", lineHeight:1.6 }}>
                Find your code in MY COUPONS, then simply enter it during checkout on the store's website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreCard({ store, onClick, earnedDiscount }) {
  return (
    <div className="zm-card" onClick={onClick} style={{
      cursor:"pointer", overflow:"hidden", transition:"all .2s",
    }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)";
      e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,.1), 0 0 0 2px ${store.color}44`; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform="";
      e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.06)"; }}
    >
      {/* Logo area */}
      <div style={{ height:100, background:"#F7F4F0",
        display:"flex", alignItems:"center", justifyContent:"center",
        borderBottom:"1px solid #E8E2DB", position:"relative" }}>
        <div style={{ width:56, height:56, borderRadius:12,
          background:`${store.color}15`, border:`1.5px solid ${store.color}33`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
          {store.emoji}
        </div>
        {earnedDiscount > 0 && (
          <div style={{ position:"absolute", top:8, right:8,
            background:"#FF5733", color:"#fff", borderRadius:50,
            padding:"2px 8px", fontSize:9, fontWeight:800 }}>
            -{earnedDiscount}%
          </div>
        )}
      </div>

      <div style={{ padding:"14px 14px 16px" }}>
        <div className="bebas" style={{ fontSize:18, letterSpacing:1, color:"#1C1C2E", marginBottom:2 }}>
          {store.name}
        </div>
        <div style={{ fontSize:10, color:"#B8B0A6", fontWeight:700,
          textTransform:"uppercase", letterSpacing:"1px", marginBottom:10 }}>
          {store.cat}
        </div>

        {/* 2 products */}
        <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:12 }}>
          {store.products.slice(0,2).map(p=>(
            <div key={p.id} style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, color:"#6B7280" }}>{p.emoji} {p.name}</span>
              <span className="mono" style={{ fontSize:11, color:"#1C1C2E", fontWeight:700 }}>${p.price}</span>
            </div>
          ))}
        </div>

        {/* Coupon tag */}
        <div style={{
          background: earnedDiscount>0 ? "rgba(79,70,229,.06)" : "#F7F4F0",
          border: earnedDiscount>0 ? "1px solid rgba(79,70,229,.2)" : "1px dashed #E2DBD2",
          borderRadius:8, padding:"6px 10px",
          fontSize:11, fontWeight:700,
          color: earnedDiscount>0 ? "#4F46E5" : "#B8B0A6",
          display:"flex", justifyContent:"space-between",
        }}>
          <span>{earnedDiscount>0 ? `🎫 ${earnedDiscount}% off active` : "🎮 Play to earn coupon"}</span>
          <span style={{ color:"#FF5733" }}>→</span>
        </div>
      </div>
    </div>
  );
}
