import React, { useState, useEffect } from "react";
import { fmt } from "../data.js";

function CheckoutModal({ cart, user, subtotal, discount, discountAmt, total, onCancel, onConfirm }) {
  const [confirmed,setConfirmed]=useState(false);
  return (
    <div className="zm-overlay" style={{zIndex:650}}>
      <div style={{
        background:"#fff",border:"1px solid #E2DBD2",borderTop:"3px solid #4F46E5",
        borderRadius:16,width:"min(480px,100%)",maxHeight:"88vh",
        overflow:"hidden",display:"flex",flexDirection:"column",
        animation:"popIn .35s cubic-bezier(.34,1.3,.64,1)",
        boxShadow:"0 20px 60px rgba(0,0,0,.15)",
      }}>
        <div style={{padding:"20px 22px 16px",borderBottom:"1px solid #E8E2DB",flexShrink:0}}>
          <div className="bebas" style={{fontSize:26,letterSpacing:1,color:"#1C1C2E"}}>ORDER SUMMARY 🛒</div>
          <p style={{fontSize:12,color:"#6B7280",marginTop:4}}>Review your items before confirming</p>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"16px 22px"}}>
          <div style={{marginBottom:16}}>
            {cart.map(item=>(
              <div key={item.productId} style={{display:"flex",justifyContent:"space-between",
                alignItems:"center",padding:"8px 0",borderBottom:"1px solid #E8E2DB"}}>
                <span style={{fontSize:12,color:"#1C1C2E"}}>{item.emoji} {item.name} <span style={{color:"#B8B0A6"}}>×{item.qty}</span></span>
                <span className="mono" style={{fontSize:12,fontWeight:700,color:"#1C1C2E"}}>{fmt(item.price*item.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{background:"#F7F4F0",border:"1px solid #E8E2DB",borderRadius:10,padding:"14px 16px"}}>
            <SRow label="Subtotal" val={fmt(subtotal)}/>
            {discount>0&&<SRow label={`🎫 Coupon (${discount}%)`} val={`−${fmt(discountAmt)}`} valColor="#22C55E"/>}
            <div style={{borderTop:"1px solid #E2DBD2",paddingTop:10,marginTop:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="bebas" style={{fontSize:16,letterSpacing:1,color:"#1C1C2E"}}>TOTAL</span>
              <span className="bebas" style={{fontSize:26,color:"#4F46E5",letterSpacing:1}}>{fmt(total)}</span>
            </div>
          </div>
          <div style={{marginTop:14,background:"rgba(79,70,229,.04)",border:"1px solid rgba(79,70,229,.1)",borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:11,color:"#B8B0A6",marginBottom:6,fontWeight:700}}>📦 DELIVERY TO</div>
            <div style={{fontSize:12,color:"#1C1C2E",fontWeight:600}}>👤 {user.username} · 📍 {user.location}</div>
            <div style={{fontSize:11,color:"#B8B0A6",marginTop:4}}>📞 {user.phone}</div>
          </div>
          <label style={{display:"flex",alignItems:"flex-start",gap:10,marginTop:16,cursor:"pointer",
            padding:"12px 14px",background:confirmed?"rgba(34,197,94,.05)":"#F7F4F0",
            border:`1.5px solid ${confirmed?"#22C55E44":"#E2DBD2"}`,borderRadius:8,transition:"all .15s"}}>
            <input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}
              style={{marginTop:1,accentColor:"#22C55E",width:14,height:14,flexShrink:0}}/>
            <span style={{fontSize:11,color:"#6B7280",lineHeight:1.5}}>
              I confirm this is a demo order. No real charge or data is processed.
            </span>
          </label>
        </div>
        <div style={{padding:"14px 22px",borderTop:"1px solid #E8E2DB",display:"flex",gap:10,flexShrink:0,background:"#F7F4F0"}}>
          <button className="zm-btn zm-btn-ghost" onClick={onCancel} style={{flex:1}}>Cancel</button>
          <button className="zm-btn zm-btn-success" onClick={onConfirm} disabled={!confirmed}
            style={{flex:2,padding:"12px"}}>✓ Confirm Order · {fmt(total)}</button>
        </div>
      </div>
    </div>
  );
}
function SRow({label,val,valColor}){
  return (
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
      <span style={{fontSize:12,color:"#6B7280",fontWeight:600}}>{label}</span>
      <span className="mono" style={{fontSize:12,fontWeight:700,color:valColor||"#1C1C2E"}}>{val}</span>
    </div>
  );
}

export default function CartDrawer({
  cart, earnedDiscount, subtotal, discountAmt, total,
  user, onClose, onRemove, onUpdateQty, onOrder, onPuzzle,
}) {
  const [showCheckout,setShowCheckout]=useState(false);
  useEffect(()=>{ const fn=e=>{if(e.key==="Escape")onClose();}; window.addEventListener("keydown",fn); return()=>window.removeEventListener("keydown",fn); },[onClose]);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  return (
    <>
      <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(28,28,46,.4)",
        backdropFilter:"blur(6px)",animation:"fadeIn .2s ease"}} onClick={onClose}/>
      <div style={{
        position:"fixed",top:0,right:0,bottom:0,zIndex:450,
        width:"min(400px,100vw)",background:"#fff",
        borderLeft:"1px solid #E8E2DB",
        display:"flex",flexDirection:"column",
        animation:"slideInR .3s cubic-bezier(.34,1.2,.64,1)",
        boxShadow:"-8px 0 40px rgba(0,0,0,.12)",
      }}>
        {/* Header */}
        <div style={{padding:"18px 20px",borderBottom:"1px solid #E8E2DB",
          display:"flex",alignItems:"center",gap:10,flexShrink:0,background:"#fff"}}>
          <span style={{fontSize:20}}>🛒</span>
          <div className="bebas" style={{fontWeight:900,fontSize:20,letterSpacing:1,color:"#1C1C2E",flex:1}}>
            YOUR CART
          </div>
          {cartCount>0&&<span style={{background:"#FF5733",color:"#fff",borderRadius:50,
            padding:"2px 8px",fontSize:11,fontWeight:800}}>{cartCount}</span>}
          <button onClick={onClose} style={{background:"none",border:"none",color:"#B8B0A6",cursor:"pointer",fontSize:18}}>✕</button>
        </div>

        {earnedDiscount>0&&(
          <div style={{background:"rgba(34,197,94,.05)",borderBottom:"1px solid rgba(34,197,94,.15)",
            padding:"8px 20px",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            <span style={{fontSize:14}}>🎫</span>
            <span style={{fontSize:12,color:"#16A34A",fontWeight:700}}>{earnedDiscount}% coupon applied!</span>
            <span style={{fontSize:11,color:"#16A34A",marginLeft:"auto"}}>Saving {fmt(discountAmt)}</span>
          </div>
        )}

        {/* Items */}
        <div style={{flex:1,overflowY:"auto",padding:"12px 20px"}}>
          {cart.length===0?(
            <div style={{textAlign:"center",padding:"48px 0",color:"#B8B0A6"}}>
              <div style={{fontSize:44,marginBottom:12}}>🛒</div>
              <div className="bebas" style={{fontSize:22,letterSpacing:1,marginBottom:6,color:"#6B7280"}}>CART IS EMPTY</div>
              <p style={{fontSize:12,marginBottom:20}}>Browse stores to add items!</p>
              <button className="zm-btn zm-btn-ghost" onClick={onClose} style={{fontSize:12}}>🏬 Go Shopping</button>
              {earnedDiscount===0&&(
                <div style={{marginTop:12}}>
                  <button className="zm-btn zm-btn-primary" onClick={onPuzzle} style={{fontSize:12}}>
                    🎮 Earn a Coupon
                  </button>
                </div>
              )}
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {cart.map(item=>(
                <div key={item.productId} style={{background:"#F7F4F0",border:"1px solid #E8E2DB",
                  borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22,flexShrink:0}}>{item.emoji}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#1C1C2E",
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                    <div style={{fontSize:10,color:"#B8B0A6",marginTop:2}}>{item.storeName} · {fmt(item.price)} ea.</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                    <button onClick={()=>onUpdateQty(item.productId,-1)} style={{width:24,height:24,borderRadius:50,
                      background:"#E8E2DB",border:"none",color:"#1C1C2E",cursor:"pointer",fontSize:14,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span className="mono" style={{fontSize:13,fontWeight:700,color:"#1C1C2E",minWidth:20,textAlign:"center"}}>{item.qty}</span>
                    <button onClick={()=>onUpdateQty(item.productId,1)} style={{width:24,height:24,borderRadius:50,
                      background:"#E8E2DB",border:"none",color:"#1C1C2E",cursor:"pointer",fontSize:14,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,minWidth:54}}>
                    <div className="mono" style={{fontSize:12,fontWeight:800,color:"#1C1C2E"}}>{fmt(item.price*item.qty)}</div>
                    {earnedDiscount>0&&<div className="mono" style={{fontSize:10,color:"#22C55E"}}>{fmt(item.price*item.qty*(1-earnedDiscount/100))}</div>}
                  </div>
                  <button onClick={()=>onRemove(item.productId)} style={{background:"none",border:"none",
                    color:"#C8C0B5",cursor:"pointer",fontSize:14,flexShrink:0,transition:"color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="#EF4444"}
                  onMouseLeave={e=>e.currentTarget.style.color="#C8C0B5"}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length>0&&(
          <div style={{padding:"16px 20px",borderTop:"1px solid #E8E2DB",flexShrink:0,background:"#F7F4F0"}}>
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"#6B7280",fontWeight:600}}>Subtotal</span>
                <span className="mono" style={{fontSize:12,color:"#1C1C2E",fontWeight:700}}>{fmt(subtotal)}</span>
              </div>
              {earnedDiscount>0&&(
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,color:"#22C55E",fontWeight:600}}>Coupon ({earnedDiscount}%)</span>
                  <span className="mono" style={{fontSize:12,color:"#22C55E",fontWeight:700}}>−{fmt(discountAmt)}</span>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                paddingTop:8,borderTop:"1px solid #E2DBD2"}}>
                <span className="bebas" style={{fontSize:16,letterSpacing:1,color:"#1C1C2E"}}>TOTAL</span>
                <span className="bebas" style={{fontSize:26,color:"#4F46E5",letterSpacing:1}}>{fmt(total)}</span>
              </div>
            </div>
            {earnedDiscount===0&&(
              <button className="zm-btn zm-btn-ghost" onClick={onPuzzle}
                style={{width:"100%",marginBottom:8,fontSize:12}}>
                🎮 Play to earn up to 15% off
              </button>
            )}
            <button className="zm-btn zm-btn-primary" onClick={()=>setShowCheckout(true)}
              style={{width:"100%",padding:"13px",fontSize:14}}>
              CHECKOUT · {fmt(total)} →
            </button>
          </div>
        )}
      </div>

      {showCheckout&&(
        <CheckoutModal cart={cart} user={user}
          subtotal={subtotal} discount={earnedDiscount}
          discountAmt={discountAmt} total={total}
          onCancel={()=>setShowCheckout(false)}
          onConfirm={()=>{setShowCheckout(false);onOrder();}}/>
      )}
    </>
  );
}
