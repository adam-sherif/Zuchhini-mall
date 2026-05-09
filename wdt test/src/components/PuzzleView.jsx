import React, { useState, useEffect, useCallback } from "react";
import { PUZZLE_LEVELS, MEM_EMOJIS, QUIZ_QUESTIONS } from "../data.js";

// ═══════════════════════ MEMORY FLIP ════════════════════════
function makeFlipCards(emojis) {
  const arr = [];
  emojis.forEach((emoji,pairIdx)=>{ arr.push({pairIdx,emoji}); arr.push({pairIdx,emoji}); });
  for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
  return arr.map((c,id)=>({...c,id}));
}

function MemoryFlipGame({ level, onComplete }) {
  const emojis = MEM_EMOJIS.slice(0,level.memPairs);
  const [cards,   setCards]   = useState(()=>makeFlipCards(emojis));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [locked,  setLocked]  = useState(false);
  const [moves,   setMoves]   = useState(0);

  function flipCard(card) {
    if(locked||matched.has(card.pairIdx)||flipped.includes(card.id)||flipped.length>=2) return;
    const nf=[...flipped,card.id]; setFlipped(nf); setMoves(m=>m+1);
    if(nf.length===2){
      setLocked(true);
      const c1=cards.find(c=>c.id===nf[0]), c2=cards.find(c=>c.id===nf[1]);
      if(c1.pairIdx===c2.pairIdx){
        const nm=new Set([...matched,c1.pairIdx]); setMatched(nm); setFlipped([]); setLocked(false);
        if(nm.size===level.memPairs) setTimeout(()=>onComplete(true),600);
      } else { setTimeout(()=>{ setFlipped([]); setLocked(false); },900); }
    }
  }

  const isVis  = card => flipped.includes(card.id)||matched.has(card.pairIdx);
  const isMatch= card => matched.has(card.pairIdx);
  const cols   = 4;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16, fontSize:12 }}>
        <span style={{color:"#6B7280",fontWeight:600}}>Moves: <b style={{color:"#1C1C2E"}}>{moves}</b></span>
        <span style={{color:"#6B7280",fontWeight:600}}>
          Matched: <b style={{color:"#22C55E"}}>{matched.size}</b>/{level.memPairs}
        </span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:8, maxWidth:340, margin:"0 auto" }}>
        {cards.map(card=>(
          <div key={card.id} onClick={()=>flipCard(card)} style={{
            width:"100%", aspectRatio:"1",
            background: isMatch(card) ? "rgba(34,197,94,.08)" : isVis(card) ? "rgba(79,70,229,.06)" : "#F7F4F0",
            border:`2px solid ${isMatch(card)?"#22C55E":isVis(card)?"#4F46E5":"#E2DBD2"}`,
            borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:isVis(card)?26:20, cursor:locked||isMatch(card)?"default":"pointer",
            transition:"border-color .2s,background .2s",
            animation:isVis(card)&&!isMatch(card)?"cardFlip .2s ease":"none",
            userSelect:"none",
          }}>
            {isVis(card)?card.emoji:"❓"}
          </div>
        ))}
      </div>
      <p style={{textAlign:"center",marginTop:16,fontSize:12,color:"#B8B0A6"}}>
        Match all {level.memPairs} pairs to win!
      </p>
    </div>
  );
}

// ═══════════════════════ SUDOKU ══════════════════════════════
const SUDOKU_PUZZLES = {
  easy:  [[1,2,0,4,3,4,0,2,0,3,4,1,4,0,2,3],[2,0,4,1,0,4,2,3,4,1,3,0,3,2,0,4]],
  normal:[[0,2,0,4,0,4,2,0,4,0,3,1,0,0,0,3],[1,0,3,0,0,3,0,2,0,1,0,4,4,0,1,0]],
  hard:  [[0,0,0,4,0,4,0,0,0,0,3,0,4,0,0,0],[0,2,0,0,0,0,2,0,4,0,0,1,0,0,0,4]],
};

function SudokuGame({ level, onComplete }) {
  const pool   = SUDOKU_PUZZLES[level.id]||SUDOKU_PUZZLES.easy;
  const puzzle = pool[Math.floor(Math.random()*pool.length)];
  const [grid, setGrid] = useState(puzzle.map(v=>({val:v,given:v!==0})));
  const [error,setError]= useState(false);

  function change(idx,val){
    if(grid[idx].given) return;
    const v=parseInt(val)||0;
    if(v<0||v>4) return;
    setGrid(g=>g.map((c,i)=>i===idx?{...c,val:v}:c)); setError(false);
  }
  function check(){
    if(grid.some(c=>c.val===0)){setError(true);return;}
    function distinct(arr){const s=arr.filter(v=>v>0);return new Set(s).size===s.length&&s.every(v=>v>=1&&v<=4);}
    let valid=true;
    for(let i=0;i<4;i++){
      if(!distinct(grid.slice(i*4,i*4+4).map(c=>c.val))||!distinct([0,1,2,3].map(r=>grid[r*4+i].val))){valid=false;break;}
    }
    if(valid){const boxes=[[0,1,4,5],[2,3,6,7],[8,9,12,13],[10,11,14,15]];for(const b of boxes)if(!distinct(b.map(i=>grid[i].val))){valid=false;break;}}
    if(valid) onComplete(true); else setError(true);
  }

  return (
    <div>
      <p style={{color:"#6B7280",fontSize:12,marginBottom:14,textAlign:"center"}}>
        Fill the 4×4 grid — each row, column, and 2×2 box must contain 1–4 once.
      </p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,
        maxWidth:220,margin:"0 auto",border:"2px solid #E2DBD2",borderRadius:8,overflow:"hidden" }}>
        {grid.map((c,i)=>{
          const row=Math.floor(i/4),col=i%4;
          return (
            <input key={i} type="number" min={1} max={4} value={c.val||""} readOnly={c.given}
              onChange={e=>change(i,e.target.value)}
              style={{ width:"100%",height:54,background:c.given?"#F7F4F0":"#fff",
                border:"none",
                borderRight:col===1?"2px solid #4F46E550":col<3?"1px solid #E2DBD2":"none",
                borderBottom:row===1?"2px solid #4F46E550":row<3?"1px solid #E2DBD2":"none",
                color:c.given?"#4F46E5":"#1C1C2E",
                fontFamily:"'JetBrains Mono',monospace",fontWeight:"700",fontSize:22,
                textAlign:"center",outline:"none",cursor:c.given?"default":"text",
                MozAppearance:"textfield" }}/>
          );
        })}
      </div>
      {error&&<p style={{textAlign:"center",color:"#EF4444",fontSize:12,marginTop:12,animation:"shake .3s ease"}}>
        ⚠️ Invalid solution — check your numbers!</p>}
      <div style={{display:"flex",justifyContent:"center",marginTop:16,gap:10}}>
        <button className="zm-btn zm-btn-primary" onClick={check}>✓ Check</button>
        <button className="zm-btn zm-btn-ghost" onClick={()=>{setGrid(puzzle.map(v=>({val:v,given:v!==0})));setError(false);}}>↺ Reset</button>
      </div>
    </div>
  );
}

// ═══════════════════════ QUIZ ════════════════════════════════
function shuffleArr(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function QuizGame({ level, onComplete }) {
  const questions = React.useMemo(()=>shuffleArr(QUIZ_QUESTIONS).slice(0,level.quizCount),[level]);
  const [qIdx,    setQIdx]    = useState(0);
  const [selected,setSelected]= useState(null);
  const [correct, setCorrect] = useState(0);
  const [answered,setAnswered]= useState(false);
  const [timeLeft,setTimeLeft]= useState(level.quizTime);
  const q = questions[qIdx];

  useEffect(()=>{ setTimeLeft(level.quizTime); setAnswered(false); setSelected(null); },[qIdx,level.quizTime]);
  useEffect(()=>{
    if(answered) return;
    if(timeLeft<=0){handleAnswer(-1);return;}
    const t=setTimeout(()=>setTimeLeft(v=>v-1),1000); return()=>clearTimeout(t);
  },[timeLeft,answered]);

  function handleAnswer(idx){
    if(answered) return; setAnswered(true); setSelected(idx);
    if(idx===q.ans) setCorrect(c=>c+1);
  }
  function nextQ(){
    if(qIdx+1>=questions.length) onComplete(correct+(selected===q.ans?1:0)>=level.quizPass);
    else setQIdx(i=>i+1);
  }

  const pct=timeLeft/level.quizTime;
  const tc=pct>.5?"#22C55E":pct>.25?"#F59E0B":"#EF4444";

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:12}}>
        <span style={{color:"#6B7280",fontWeight:600}}>Q <b style={{color:"#1C1C2E"}}>{qIdx+1}</b>/{questions.length}</span>
        <span style={{color:"#6B7280",fontWeight:600}}>✅ <b style={{color:"#22C55E"}}>{correct}</b> / Need {level.quizPass}</span>
      </div>
      <div style={{height:5,background:"#E8E2DB",borderRadius:3,marginBottom:16,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct*100}%`,background:tc,borderRadius:3,transition:"width 1s linear,background .3s"}}/>
      </div>
      <div style={{textAlign:"right",fontSize:11,color:tc,fontWeight:800,marginBottom:12,marginTop:-12}}>⏱ {timeLeft}s</div>
      <div style={{background:"#F7F4F0",border:"1px solid #E8E2DB",borderRadius:10,padding:"14px 16px",
        marginBottom:14,fontSize:14,fontWeight:700,color:"#1C1C2E",lineHeight:1.5}}>
        🛍️ {q.q}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {q.opts.map((opt,i)=>{
          let bg="#fff",border="#E2DBD2",color="#1C1C2E";
          if(answered){
            if(i===q.ans){bg="rgba(34,197,94,.08)";border="#22C55E";color="#22C55E";}
            else if(i===selected){bg="rgba(239,68,68,.06)";border="#EF4444";color="#EF4444";}
          }
          return (
            <button key={i} onClick={()=>handleAnswer(i)} disabled={answered} style={{
              background:bg,border:`1.5px solid ${border}`,borderRadius:10,
              padding:"11px 14px",color,fontFamily:"'DM Sans',sans-serif",
              fontWeight:600,fontSize:13,textAlign:"left",
              cursor:answered?"default":"pointer",transition:"all .15s",
              display:"flex",alignItems:"center",gap:8,
            }}
            onMouseEnter={e=>{ if(!answered){e.currentTarget.style.borderColor="#4F46E5";e.currentTarget.style.color="#4F46E5";} }}
            onMouseLeave={e=>{ if(!answered){e.currentTarget.style.borderColor="#E2DBD2";e.currentTarget.style.color="#1C1C2E";} }}
            >
              <span style={{ width:22,height:22,borderRadius:"50%",
                background:answered&&i===q.ans?"#22C55E":answered&&i===selected?"#EF4444":"#F7F4F0",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:800,color:answered&&(i===q.ans||i===selected)?"#fff":"#6B7280",flexShrink:0 }}>
                {answered&&i===q.ans?"✓":answered&&i===selected?"✗":String.fromCharCode(65+i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered&&(
        <div style={{marginTop:14,textAlign:"center"}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:12,color:selected===q.ans?"#22C55E":"#EF4444"}}>
            {selected===q.ans?"✅ Correct!":selected===-1?"⏰ Time's up!":"❌ Wrong!"}
          </div>
          {qIdx+1<questions.length
            ?<button className="zm-btn zm-btn-primary" onClick={nextQ}>Next →</button>
            :<button className="zm-btn zm-btn-accent" onClick={nextQ}>See Results 🏁</button>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════ PUZZLE VIEW ═════════════════════════
const GAMES=[
  {id:"flip",  label:"Memory Flip", icon:"🃏", desc:"Match all card pairs from memory"},
  {id:"sudoku",label:"Sudoku",      icon:"🔢", desc:"Complete the 4×4 number grid"},
  {id:"quiz",  label:"Mall Quiz",   icon:"❓", desc:"Answer shopping knowledge questions"},
];

export default function PuzzleView({ onWin, onBack, currentDiscount }) {
  const [screen,  setScreen]  = useState("levelSelect");
  const [selLevel,setSelLevel]= useState(null);
  const [selGame, setSelGame] = useState(null);
  const [won,     setWon]     = useState(null);

  function handleComplete(didWin){
    setWon(didWin); setScreen("result");
    if(didWin) onWin(selLevel.discount);
  }
  function restart(){ setScreen("levelSelect");setSelLevel(null);setSelGame(null);setWon(null); }

  return (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"32px 16px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
        <button className="zm-btn zm-btn-ghost" onClick={onBack} style={{ padding:"8px 16px", fontSize:12 }}>← Back</button>
        <div>
          <div className="bebas" style={{ fontSize:30, letterSpacing:2, color:"#1C1C2E" }}>MY COUPONS 🎮</div>
          <p style={{ fontSize:12, color:"#6B7280" }}>Win mini-games to earn discount coupons for all stores</p>
        </div>
        {currentDiscount>0&&(
          <div style={{ marginLeft:"auto", background:"#FF5733",color:"#fff",
            borderRadius:50,padding:"4px 14px",fontSize:11,fontWeight:800 }}>
            🎫 {currentDiscount}% Active
          </div>
        )}
      </div>

      {/* LEVEL SELECT */}
      {screen==="levelSelect"&&(
        <div style={{animation:"slideUp .3s ease"}}>
          <p style={{color:"#6B7280",fontSize:13,marginBottom:20,textAlign:"center"}}>
            Choose a difficulty. Higher level = bigger discount, harder challenge!
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {PUZZLE_LEVELS.map(lv=>(
              <div key={lv.id} className="zm-card" onClick={()=>{setSelLevel(lv);setScreen("gameSelect");}} style={{
                padding:"20px 22px", cursor:"pointer",
                borderLeft:`4px solid ${lv.color}`,
                display:"flex", alignItems:"center", justifyContent:"space-between",
                transition:"all .2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateX(4px)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.06)";}}
              >
                <div>
                  <div className="bebas" style={{fontSize:22,letterSpacing:1,color:"#1C1C2E",marginBottom:4}}>
                    {lv.id==="easy"?"😊":lv.id==="normal"?"😤":"🔥"} {lv.label.toUpperCase()}
                  </div>
                  <div style={{fontSize:12,color:"#6B7280"}}>
                    Flip: {lv.memPairs} pairs · Quiz: {lv.quizCount} Qs · Sudoku included
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="bebas" style={{fontSize:36,color:lv.color,letterSpacing:1}}>{lv.discount}%</div>
                  <div style={{fontSize:10,color:"#B8B0A6",fontWeight:700}}>DISCOUNT</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAME SELECT */}
      {screen==="gameSelect"&&selLevel&&(
        <div style={{animation:"slideUp .3s ease"}}>
          <div style={{
            background:`${selLevel.color}10`, border:`1px solid ${selLevel.color}33`,
            borderRadius:10, padding:"12px 18px", marginBottom:20,
            display:"flex",alignItems:"center",justifyContent:"space-between",
          }}>
            <span style={{fontSize:13,fontWeight:700,color:selLevel.color}}>
              {selLevel.id==="easy"?"😊":selLevel.id==="normal"?"😤":"🔥"} {selLevel.label} level
            </span>
            <span className="bebas" style={{fontSize:22,color:selLevel.color,letterSpacing:1}}>
              {selLevel.discount}% on win
            </span>
          </div>
          <p style={{color:"#6B7280",fontSize:13,marginBottom:16,textAlign:"center"}}>Pick a game:</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {GAMES.map(g=>(
              <div key={g.id} className="zm-card" onClick={()=>{setSelGame(g.id);setScreen("playing");}} style={{
                padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:16,transition:"all .2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#4F46E5";e.currentTarget.style.transform="translateX(3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8E2DB";e.currentTarget.style.transform="";}}
              >
                <span style={{fontSize:32}}>{g.icon}</span>
                <div>
                  <div className="bebas" style={{fontSize:20,letterSpacing:1,color:"#1C1C2E"}}>{g.label.toUpperCase()}</div>
                  <div style={{fontSize:12,color:"#6B7280"}}>{g.desc}</div>
                </div>
                <span style={{marginLeft:"auto",color:"#4F46E5",fontSize:18}}>→</span>
              </div>
            ))}
          </div>
          <button className="zm-btn zm-btn-ghost" style={{marginTop:14,width:"100%"}} onClick={()=>setScreen("levelSelect")}>
            ← Change Level
          </button>
        </div>
      )}

      {/* PLAYING */}
      {screen==="playing"&&selLevel&&selGame&&(
        <div style={{animation:"slideUp .3s ease"}}>
          <div style={{ background:"#fff",border:"1px solid #E8E2DB",borderRadius:10,
            padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <span className="bebas" style={{fontWeight:800,color:"#1C1C2E",fontSize:18,letterSpacing:1}}>
              {GAMES.find(g=>g.id===selGame)?.icon} {GAMES.find(g=>g.id===selGame)?.label.toUpperCase()}
            </span>
            <span style={{ background:`${selLevel.color}15`,border:`1px solid ${selLevel.color}44`,
              borderRadius:50,padding:"3px 12px",fontSize:11,fontWeight:800,color:selLevel.color }}>
              {selLevel.label} · Win = {selLevel.discount}% off
            </span>
          </div>
          {selGame==="flip"  &&<MemoryFlipGame key="flip"   level={selLevel} onComplete={handleComplete}/>}
          {selGame==="sudoku"&&<SudokuGame     key="sudoku" level={selLevel} onComplete={handleComplete}/>}
          {selGame==="quiz"  &&<QuizGame       key="quiz"   level={selLevel} onComplete={handleComplete}/>}
          <button className="zm-btn zm-btn-ghost" style={{marginTop:20,width:"100%"}} onClick={()=>setScreen("gameSelect")}>
            ← Change Game
          </button>
        </div>
      )}

      {/* RESULT */}
      {screen==="result"&&selLevel&&(
        <div style={{textAlign:"center",animation:"popIn .4s cubic-bezier(.34,1.4,.64,1)"}}>
          {won?(
            <>
              <div style={{fontSize:64,marginBottom:12,animation:"floatY 2s ease-in-out infinite"}}>🎉</div>
              <div className="bebas" style={{fontSize:40,letterSpacing:2,color:"#22C55E",marginBottom:8}}>YOU WON!</div>
              <p style={{color:"#6B7280",marginBottom:24,fontSize:14}}>Amazing! Here is your coupon.</p>
              <div style={{ background:"#F7F4F0",border:`2px dashed ${selLevel.color}`,
                borderRadius:16,padding:"28px",marginBottom:24,display:"inline-block",minWidth:200 }}>
                <div style={{fontSize:11,color:selLevel.color,fontWeight:800,letterSpacing:"3px",marginBottom:6}}>
                  YOUR COUPON
                </div>
                <div className="bebas" style={{fontSize:64,color:selLevel.color,letterSpacing:2,lineHeight:1}}>
                  {selLevel.discount}%
                </div>
                <div style={{fontSize:12,color:selLevel.color,fontWeight:700,marginTop:4}}>OFF ALL STORES</div>
                <div className="mono" style={{fontSize:10,color:"#B8B0A6",marginTop:12,
                  background:"#fff",borderRadius:6,padding:"4px 10px",display:"inline-block",border:"1px solid #E2DBD2"}}>
                  ZUC-{selLevel.id.toUpperCase()}-{Math.random().toString(36).substring(2,6).toUpperCase()}
                </div>
              </div>
              <p style={{color:"#22C55E",fontSize:12,marginBottom:20,fontWeight:700}}>
                ✅ Applied to your cart automatically!
              </p>
            </>
          ):(
            <>
              <div style={{fontSize:64,marginBottom:12}}>😔</div>
              <div className="bebas" style={{fontSize:40,letterSpacing:2,color:"#EF4444",marginBottom:8}}>NOT THIS TIME!</div>
              <p style={{color:"#6B7280",marginBottom:24,fontSize:14}}>Keep trying — you're almost there!</p>
            </>
          )}
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="zm-btn zm-btn-primary" onClick={restart}>🎮 Play Again</button>
            <button className="zm-btn zm-btn-ghost" onClick={onBack}>🏬 Go Shopping</button>
          </div>
        </div>
      )}
    </div>
  );
}
