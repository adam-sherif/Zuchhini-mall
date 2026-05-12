import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PUZZLE_LEVELS, MEM_EMOJIS, QUIZ_QUESTIONS } from "../data.js";

// ═══════════════════════ MEMORY FLIP ════════════════════════
function makeFlipCards(emojis) {
  const arr = [];
  emojis.forEach((emoji, pairIdx) => { arr.push({ pairIdx, emoji }); arr.push({ pairIdx, emoji }); });
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr.map((c, id) => ({ ...c, id }));
}

function MemoryFlipGame({ level, onComplete }) {
  const emojis = MEM_EMOJIS.slice(0, level.memPairs);
  const [cards, setCards] = useState(() => makeFlipCards(emojis));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  function flipCard(card) {
    if (locked || matched.has(card.pairIdx) || flipped.includes(card.id) || flipped.length >= 2) return;
    const nf = [...flipped, card.id]; setFlipped(nf); setMoves(m => m + 1);
    if (nf.length === 2) {
      setLocked(true);
      const c1 = cards.find(c => c.id === nf[0]), c2 = cards.find(c => c.id === nf[1]);
      if (c1.pairIdx === c2.pairIdx) {
        const nm = new Set([...matched, c1.pairIdx]); setMatched(nm); setFlipped([]); setLocked(false);
        if (nm.size === level.memPairs) setTimeout(() => onComplete(true), 600);
      } else { setTimeout(() => { setFlipped([]); setLocked(false); }, 900); }
    }
  }

  const isVis = card => flipped.includes(card.id) || matched.has(card.pairIdx);
  const isMatch = card => matched.has(card.pairIdx);
  const cols = 4;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 12 }}>
        <span style={{ color: "#6B7280", fontWeight: 600 }}>Moves: <b style={{ color: "#1C1C2E" }}>{moves}</b></span>
        <span style={{ color: "#6B7280", fontWeight: 600 }}>
          Matched: <b style={{ color: "#22C55E" }}>{matched.size}</b>/{level.memPairs}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 8, maxWidth: 340, margin: "0 auto" }}>
        {cards.map(card => (
          <div key={card.id} onClick={() => flipCard(card)} style={{
            width: "100%",
            aspectRatio: "1",
            background: isMatch(card) ? "rgba(34,197,94,.08)" : isVis(card) ? "rgba(79,70,229,.06)" : "#F7F4F0",
            border: `2px solid ${isMatch(card) ? "#22C55E" : isVis(card) ? "#4F46E5" : "#E2DBD2"}`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isVis(card) ? 26 : 20,
            cursor: locked || isMatch(card) ? "default" : "pointer",
            transition: "border-color .2s,background .2s",
            animation: isVis(card) && !isMatch(card) ? "cardFlip .2s ease" : "none",
            userSelect: "none",
          }}>
            {isVis(card) ? card.emoji : "❓"}
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#B8B0A6" }}>
        Match all {level.memPairs} pairs to win!
      </p>
    </div>
  );
}

// ═══════════════════════ SUDOKU ══════════════════════════════
const SUDOKU_PUZZLES = {
  easy: [[1, 2, 0, 4, 3, 4, 0, 2, 0, 3, 4, 1, 4, 0, 2, 3], [2, 0, 4, 1, 0, 4, 2, 3, 4, 1, 3, 0, 3, 2, 0, 4]],
  normal: [[0, 2, 0, 4, 0, 4, 2, 0, 4, 0, 3, 1, 0, 0, 0, 3], [1, 0, 3, 0, 0, 3, 0, 2, 0, 1, 0, 4, 4, 0, 1, 0]],
  hard: [[0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 3, 0, 4, 0, 0, 0], [0, 2, 0, 0, 0, 0, 2, 0, 4, 0, 0, 1, 0, 0, 0, 4]],
};

function SudokuGame({ level, onComplete }) {
  const pool = SUDOKU_PUZZLES[level.id] || SUDOKU_PUZZLES.easy;
  const puzzle = pool[Math.floor(Math.random() * pool.length)];
  const [grid, setGrid] = useState(puzzle.map(v => ({ val: v, given: v !== 0 })));
  const [error, setError] = useState(false);

  function change(idx, val) {
    if (grid[idx].given) return;
    const v = parseInt(val) || 0;
    if (v < 0 || v > 4) return;
    setGrid(g => g.map((c, i) => i === idx ? { ...c, val: v } : c)); setError(false);
  }

  function check() {
    if (grid.some(c => c.val === 0)) { setError(true); return; }
    function distinct(arr) { const s = arr.filter(v => v > 0); return new Set(s).size === s.length && s.every(v => v >= 1 && v <= 4); }
    let valid = true;
    for (let i = 0; i < 4; i++) {
      if (!distinct(grid.slice(i * 4, i * 4 + 4).map(c => c.val)) || !distinct([0, 1, 2, 3].map(r => grid[r * 4 + i].val))) { valid = false; break; }
    }
    if (valid) { const boxes = [[0, 1, 4, 5], [2, 3, 6, 7], [8, 9, 12, 13], [10, 11, 14, 15]]; for (const b of boxes) if (!distinct(b.map(i => grid[i].val))) { valid = false; break; } }
    if (valid) onComplete(true); else setError(true);
  }

  return (
    <div>
      <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 14, textAlign: "center" }}>
        Fill the 4×4 grid — each row, column, and 2×2 box must contain 1–4 once.
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 0,
        maxWidth: 220,
        margin: "0 auto",
        border: "2px solid #E2DBD2",
        borderRadius: 8,
        overflow: "hidden",
      }}>
        {grid.map((c, i) => {
          const row = Math.floor(i / 4), col = i % 4;
          return (
            <input key={i} type="number" min={1} max={4} value={c.val || ""} readOnly={c.given}
              onChange={e => change(i, e.target.value)}
              style={{
                width: "100%",
                height: 54,
                background: c.given ? "#F7F4F0" : "#fff",
                border: "none",
                borderRight: col === 1 ? "2px solid #4F46E550" : col < 3 ? "1px solid #E2DBD2" : "none",
                borderBottom: row === 1 ? "2px solid #4F46E550" : row < 3 ? "1px solid #E2DBD2" : "none",
                color: c.given ? "#4F46E5" : "#1C1C2E",
                fontFamily: "'JetBrains Mono',monospace",
                fontWeight: "700",
                fontSize: 22,
                textAlign: "center",
                outline: "none",
                cursor: c.given ? "default" : "text",
                MozAppearance: "textfield",
              }} />
          );
        })}
      </div>
      {error && <p style={{ textAlign: "center", color: "#EF4444", fontSize: 12, marginTop: 12, animation: "shake .3s ease" }}>
        ⚠️ Invalid solution — check your numbers!</p>}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16, gap: 10 }}>
        <button className="zm-btn zm-btn-primary" onClick={check}>✓ Check</button>
        <button className="zm-btn zm-btn-ghost" onClick={() => { setGrid(puzzle.map(v => ({ val: v, given: v !== 0 }))); setError(false); }}>↺ Reset</button>
      </div>
    </div>
  );
}

// ═══════════════════════ QUIZ ════════════════════════════════
function shuffleArr(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function QuizGame({ level, onComplete }) {
  const questions = useMemo(() => shuffleArr(QUIZ_QUESTIONS).slice(0, level.quizCount), [level]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(level.quizTime);
  
  const q = questions[qIdx];
  // Shuffle answer options but track which position correct answer is now in
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const [correctIdx, setCorrectIdx] = useState(0);

  useEffect(() => {
    if (!q) return;
    const opts = [...q.opts];
    const correctAns = q.ans;
    const shuffled = [...opts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Find where the correct answer ended up
    const newCorrectIdx = shuffled.findIndex((opt, idx) => opts[correctAns] === opt);
    setShuffledOpts(shuffled);
    setCorrectIdx(newCorrectIdx);
  }, [q]);

  useEffect(() => { setTimeLeft(level.quizTime); setAnswered(false); setSelected(null); }, [qIdx, level.quizTime]);
  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, answered]);

  function handleAnswer(idx) {
    if (answered) return;
    setAnswered(true);
    setSelected(idx);
    if (idx === correctIdx) setCorrect(c => c + 1);
  }

  function nextQ() {
    if (qIdx + 1 >= questions.length) onComplete(correct + (selected === correctIdx ? 1 : 0) >= level.quizPass);
    else { setQIdx(qIdx + 1); }
  }

  const prog = ((qIdx + 1) / questions.length) * 100;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
            Q{qIdx + 1} of {questions.length}
          </div>
          <div style={{
            width: "100%",
            height: 4,
            background: "#E8E2DB",
            borderRadius: 2,
            overflow: "hidden",
          }}>
            <div style={{
              width: `${prog}%`,
              height: "100%",
              background: "#4F46E5",
              transition: "width .3s ease",
            }} />
          </div>
        </div>
        <div style={{
          marginLeft: 12,
          fontSize: 11,
          fontWeight: 800,
          color: timeLeft <= 5 ? "#EF4444" : "#6B7280",
          minWidth: 32,
          textAlign: "center",
        }}>
          {timeLeft}s
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1C1C2E", marginBottom: 14 }}>
          {q.q}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {shuffledOpts.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === correctIdx;
            let bgColor = "#F7F4F0", borderColor = "#E8E2DB", textColor = "#1C1C2E";
            if (answered) {
              if (isCorrect) { bgColor = "rgba(34,197,94,.08)"; borderColor = "#22C55E"; textColor = "#22C55E"; }
              else if (isSelected && !isCorrect) { bgColor = "rgba(239,68,68,.08)"; borderColor = "#EF4444"; textColor = "#EF4444"; }
            } else if (isSelected) {
              bgColor = "rgba(79,70,229,.06)"; borderColor = "#4F46E5";
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered}
                style={{
                  width: "100%",
                  background: bgColor,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: 10,
                  padding: "12px 16px",
                  textAlign: "left",
                  cursor: answered ? "default" : "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  color: textColor,
                  transition: "all .2s",
                }}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <button className="zm-btn zm-btn-primary" onClick={nextQ} disabled={!answered} style={{ width: "100%", padding: "12px" }}>
        {qIdx + 1 >= questions.length ? "See Results" : "Next Question"}
      </button>
    </div>
  );
}

// ═══════════════════════ PUZZLE VIEW ═════════════════════════
export default function PuzzleView({ onWin, onBack, currentDiscount }) {
  const [screen, setScreen] = useState("levelSelect");
  const [selLevel, setSelLevel] = useState(null);
  const [gameSeq, setGameSeq] = useState([]);
  const [gameIdx, setGameIdx] = useState(0);
  const [won, setWon] = useState(false);
  const [attemptUsed, setAttemptUsed] = useState(false);

  // Auto-select random game
  useEffect(() => {
    if (selLevel) {
      const games = ["flip", "sudoku", "quiz"];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      setGameSeq([randomGame]);
      setGameIdx(0);
      setAttemptUsed(false);
    }
  }, [selLevel]);

  function handleLevelSelect(level) {
    if (attemptUsed && currentDiscount > 0) {
      alert(`You've already played today! Your current discount: ${currentDiscount}%\n\nCome back tomorrow for another attempt.`);
      return;
    }
    setSelLevel(level);
    setScreen("playing");
  }

  function handleGameComplete(won) {
    setWon(won);
    setScreen("result");
    setAttemptUsed(true);
    if (won) {
      onWin(selLevel.discount);
    }
  }

  function restart() {
    setScreen("levelSelect");
    setSelLevel(null);
    setGameSeq([]);
    setGameIdx(0);
    setWon(false);
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(16px, 4vw, 32px)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        <button className="zm-btn zm-btn-ghost" onClick={onBack} style={{ padding: "8px 16px", fontSize: 12 }}>
          ← Back
        </button>
        <div>
          <div className="bebas" style={{
            fontSize: "clamp(20px, 5vw, 30px)",
            letterSpacing: 2,
            color: "#1C1C2E",
          }}>
            MY COUPONS 🎮
          </div>
          <p style={{ fontSize: "clamp(11px, 2vw, 12px)", color: "#6B7280" }}>
            Win one game to earn your discount
          </p>
        </div>
        {currentDiscount > 0 && (
          <div style={{
            marginLeft: "auto",
            background: "#FF5733",
            color: "#fff",
            borderRadius: 50,
            padding: "4px 14px",
            fontSize: "clamp(10px, 1.5vw, 11px)",
            fontWeight: 800,
          }}>
            🎫 {currentDiscount}% Active
          </div>
        )}
      </div>

      {/* LEVEL SELECT */}
      {screen === "levelSelect" && (
        <div style={{ animation: "slideUp .3s ease" }}>
          <p style={{
            color: "#6B7280",
            fontSize: "clamp(12px, 2vw, 13px)",
            marginBottom: 20,
            textAlign: "center",
          }}>
            Choose difficulty. Win the game to earn your coupon!<br />
            <span style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>⚠️ Only 1 attempt per day</span>
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PUZZLE_LEVELS.map(lv => (
              <div
                key={lv.id}
                className="zm-card"
                onClick={() => handleLevelSelect(lv)}
                style={{
                  padding: "clamp(16px, 3vw, 20px) clamp(18px, 3vw, 22px)",
                  cursor: attemptUsed && currentDiscount > 0 ? "not-allowed" : "pointer",
                  borderLeft: `4px solid ${lv.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all .2s",
                  opacity: attemptUsed && currentDiscount > 0 ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  if (!(attemptUsed && currentDiscount > 0)) {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.1)";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.06)";
                }}
              >
                <div>
                  <div className="bebas" style={{
                    fontSize: "clamp(16px, 3vw, 22px)",
                    letterSpacing: 1,
                    color: "#1C1C2E",
                    marginBottom: 4,
                  }}>
                    {lv.id === "easy" ? "😊" : lv.id === "normal" ? "😤" : "🔥"} {lv.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "clamp(11px, 1.5vw, 12px)", color: "#6B7280" }}>
                    Memory: {lv.memPairs} pairs · Quiz: {lv.quizCount} Qs · Sudoku 4×4
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="bebas" style={{
                    fontSize: "clamp(28px, 6vw, 36px)",
                    color: lv.color,
                    letterSpacing: 1,
                  }}>
                    {lv.discount}%
                  </div>
                  <div style={{ fontSize: "clamp(9px, 1.5vw, 10px)", color: "#B8B0A6", fontWeight: 700 }}>
                    COUPON
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLAYING */}
      {screen === "playing" && selLevel && gameSeq[gameIdx] && (
        <div style={{ animation: "slideUp .3s ease" }}>
          <div style={{
            background: "#fff",
            border: "1px solid #E8E2DB",
            borderRadius: 10,
            padding: "clamp(10px, 2vw, 16px)",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <span className="bebas" style={{
              fontWeight: 800,
              color: "#1C1C2E",
              fontSize: "clamp(14px, 3vw, 18px)",
              letterSpacing: 1,
            }}>
              {["🧠", "🧩", "🎯"][gameSeq[gameIdx] === "flip" ? 0 : gameSeq[gameIdx] === "sudoku" ? 1 : 2]} {gameSeq[gameIdx] === "flip" ? "MEMORY FLIP" : gameSeq[gameIdx] === "sudoku" ? "SUDOKU" : "QUICK QUIZ"}
            </span>
            <span style={{
              background: `${selLevel.color}15`,
              border: `1px solid ${selLevel.color}44`,
              borderRadius: 50,
              padding: "3px 12px",
              fontSize: "clamp(10px, 1.5vw, 11px)",
              fontWeight: 800,
              color: selLevel.color,
            }}>
              {selLevel.label} · Win = {selLevel.discount}% off
            </span>
          </div>
          {gameSeq[gameIdx] === "flip" && <MemoryFlipGame key="flip" level={selLevel} onComplete={handleGameComplete} />}
          {gameSeq[gameIdx] === "sudoku" && <SudokuGame key="sudoku" level={selLevel} onComplete={handleGameComplete} />}
          {gameSeq[gameIdx] === "quiz" && <QuizGame key="quiz" level={selLevel} onComplete={handleGameComplete} />}
        </div>
      )}

      {/* RESULT */}
      {screen === "result" && selLevel && (
        <div style={{ textAlign: "center", animation: "popIn .4s cubic-bezier(.34,1.4,.64,1)" }}>
          {won ? (
            <>
              <div style={{ fontSize: "clamp(48px, 12vw, 64px)", marginBottom: 12, animation: "floatY 2s ease-in-out infinite" }}>
                🎉
              </div>
              <div className="bebas" style={{
                fontSize: "clamp(28px, 6vw, 40px)",
                letterSpacing: 2,
                color: "#22C55E",
                marginBottom: 8,
              }}>
                YOU WON!
              </div>
              <p style={{ color: "#6B7280", marginBottom: 24, fontSize: "clamp(12px, 2vw, 14px)" }}>
                Awesome! You won the game and earned your coupon.
              </p>
              <div style={{
                background: "#F7F4F0",
                border: `2px dashed ${selLevel.color}`,
                borderRadius: 16,
                padding: "clamp(16px, 4vw, 28px)",
                marginBottom: 24,
                display: "inline-block",
                minWidth: 200,
              }}>
                <div style={{
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  color: selLevel.color,
                  fontWeight: 800,
                  letterSpacing: "3px",
                  marginBottom: 6,
                }}>
                  YOUR COUPON
                </div>
                <div className="bebas" style={{
                  fontSize: "clamp(40px, 10vw, 64px)",
                  color: selLevel.color,
                  letterSpacing: 2,
                  lineHeight: 1,
                }}>
                  {selLevel.discount}%
                </div>
                <div style={{
                  fontSize: "clamp(11px, 2vw, 12px)",
                  color: selLevel.color,
                  fontWeight: 700,
                  marginTop: 4,
                }}>
                  OFF ALL STORES
                </div>
                <div className="mono" style={{
                  fontSize: "clamp(9px, 1.5vw, 10px)",
                  color: "#B8B0A6",
                  marginTop: 12,
                  background: "#fff",
                  borderRadius: 6,
                  padding: "4px 10px",
                  display: "inline-block",
                  border: "1px solid #E2DBD2",
                }}>
                  ZUC-{selLevel.id.toUpperCase()}-{Math.random().toString(36).substring(2, 6).toUpperCase()}
                </div>
              </div>
              <p style={{ color: "#22C55E", fontSize: "clamp(11px, 2vw, 12px)", marginBottom: 20, fontWeight: 700 }}>
                ✅ Applied automatically!
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: "clamp(48px, 12vw, 64px)", marginBottom: 12 }}>😔</div>
              <div className="bebas" style={{
                fontSize: "clamp(28px, 6vw, 40px)",
                letterSpacing: 2,
                color: "#EF4444",
                marginBottom: 8,
              }}>
                NOT THIS TIME!
              </div>
              <p style={{ color: "#6B7280", marginBottom: 24, fontSize: "clamp(12px, 2vw, 14px)" }}>
                Keep trying — you're almost there!
              </p>
            </>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="zm-btn zm-btn-primary" onClick={restart}>
              🎮 Try Another Level
            </button>
            <button className="zm-btn zm-btn-ghost" onClick={onBack}>
              🏬 Go Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
