import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from '../lib/supabaseClient';

const CS = 32;
const COLS = 19;
const ROWS = 17;

// 0=tembok, 1=jalan, 2=jawaban zona A, 3=jawaban zona B, 4=jawaban zona C, 5=jawabn zona D
const BASE_MAP = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,2,2,2,1,1,1,1,1,1,1,1,3,3,3,3,1,0],
  [0,1,2,2,2,1,1,1,1,0,0,0,1,3,3,3,3,1,0],
  [0,1,2,2,2,1,0,0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,1,0],
  [0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0],
  [0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0],
  [0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0],
  [0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0],
  [0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0],
  [0,1,0,0,0,0,0,1,0,1,5,5,5,1,0,1,0,1,0],
  [4,4,4,1,1,1,1,1,0,1,5,5,5,1,1,1,1,1,0],
  [4,4,4,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
  [4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Soal IPA - 5 soal
const QUESTIONS = [
  {
    q: "Apa nama proses tumbuhan membuat makanannya sendiri?",
    opts: ["Respirasi", "Fotosintesis", "Fermentasi", "Transpirasi"],
    correct: 1,
  },
  {
    q: "Planet mana yang paling dekat dengan Matahari?",
    opts: ["Venus", "Bumi", "Merkurius", "Mars"],
    correct: 2,
  },
  {
    q: "Apa yang dihasilkan tumbuhan saat fotosintesis?",
    opts: ["CO₂ & Air", "O₂ & Glukosa", "N₂ & Protein", "H₂ & Lemak"],
    correct: 1,
  },
  {
    q: "Berapa suhu titik didih air pada tekanan normal?",
    opts: ["90°C", "120°C", "80°C", "100°C"],
    correct: 3,
  },
  {
    q: "Organ manakah yang memompa darah ke seluruh tubuh?",
    opts: ["Paru-paru", "Ginjal", "Jantung", "Hati"],
    correct: 2,
  },
];

// Mapping Jawaban (A=0, B=1, C=2, D=3)
const ZONE_LABELS = { 2: "A", 3: "B", 4: "C", 5: "D" };
const ZONE_COLORS = {
  2: { border: "#ff4da6", glow: "rgba(255,77,166,0.4)", text: "#ff4da6", bg: "rgba(255,77,166,0.12)" },
  3: { border: "#00e5ff", glow: "rgba(0,229,255,0.4)", text: "#00e5ff", bg: "rgba(0,229,255,0.12)" },
  4: { border: "#b967ff", glow: "rgba(185,103,255,0.4)", text: "#b967ff", bg: "rgba(185,103,255,0.12)" },
  5: { border: "#ffd700", glow: "rgba(255,215,0,0.4)", text: "#ffd700", bg: "rgba(255,215,0,0.12)" },
};

function initMap() { return BASE_MAP.map(r => [...r]); }
function canMove(map, x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
  return map[y][x] !== 0;
}

function ghostAI(ghost, player, map) {
  const dirs = [{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
  const valid = dirs.filter(d => {
    const nx = ghost.x + d.dx, ny = ghost.y + d.dy;
    return canMove(map, nx, ny) && !(d.dx === -ghost.dx && d.dy === -ghost.dy);
  });
  if (!valid.length) return ghost;
  if (ghost.scared) {
    const r = valid[Math.floor(Math.random() * valid.length)];
    return { ...ghost, x: ghost.x + r.dx, y: ghost.y + r.dy, dx: r.dx, dy: r.dy };
  }
  const best = valid.reduce((b, d) => {
    const dist = Math.abs(ghost.x + d.dx - player.x) + Math.abs(ghost.y + d.dy - player.y);
    return dist < b.dist ? { d, dist } : b;
  }, { d: valid[0], dist: Infinity });
  return { ...ghost, x: ghost.x + best.d.dx, y: ghost.y + best.d.dy, dx: best.d.dx, dy: best.d.dy };
}

const GHOST_CONFIGS = [
  { x: 9, y: 3, dx: 1, dy: 0, color: "#ff4da6", scaredColor: "#3333cc" },
  { x: 9, y: 10, dx: -1, dy: 0, color: "#00e5ff", scaredColor: "#3333cc" },
  { x: 14, y: 7, dx: 0, dy: 1, color: "#b967ff", scaredColor: "#3333cc" },
];

export default function NeonPacmanV2() {
  const [map] = useState(initMap);
  const [qIdx, setQIdx] = useState(0);
  const [player, setPlayer] = useState({ x: 9, y: 8, dx: 1, dy: 0, mouth: 0 });
  const [ghosts, setGhosts] = useState(GHOST_CONFIGS.map(g => ({ ...g, scared: false })));
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [credits, setCredits] = useState(0);
  const [gameState, setGameState] = useState("question"); // question, playing, feedback, dead, gameover, win
  const [inputDir, setInputDir] = useState({ dx: 1, dy: 0 });
  const [feedback, setFeedback] = useState(null); // { correct: bool, zone: int }
  const [answeredZones, setAnsweredZones] = useState(new Set());
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const canvasRef = useRef(null);
  const stateRef = useRef({});
  const tickRef = useRef(0);

  const currentQ = QUESTIONS[qIdx % QUESTIONS.length];
  // Map zone type -> answer option index
  // Zone 2=A=opt0, 3=B=opt1, 4=C=opt2, 5=D=opt3
  const zoneToOptIdx = { 2: 0, 3: 1, 4: 2, 5: 3 };

  useEffect(() => {
    stateRef.current = { player, ghosts, gameState, inputDir, feedback, answeredZones, questionAnswered, score, lives, qIdx, credits };
  });

  // Keyboard
  useEffect(() => {
    const DIRS = {
      ArrowUp: {dx:0,dy:-1}, ArrowDown: {dx:0,dy:1},
      ArrowLeft: {dx:-1,dy:0}, ArrowRight: {dx:1,dy:0},
      w:{dx:0,dy:-1}, s:{dx:0,dy:1}, a:{dx:-1,dy:0}, d:{dx:1,dy:0},
    };
    const onKey = e => {
      if (DIRS[e.key]) { e.preventDefault(); setInputDir(DIRS[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      const { player: p, ghosts: gs, inputDir: id, answeredZones: az, score: sc, lives: lv, qIdx: qi, credits: cr } = stateRef.current;
      tickRef.current++;

      // Move player
      let np = { ...p, mouth: (p.mouth + 1) % 8 };
      const tryX = p.x + id.dx, tryY = p.y + id.dy;
      if (canMove(map, tryX, tryY)) {
        np = { ...np, x: tryX, y: tryY, dx: id.dx, dy: id.dy };
      } else {
        const cx = p.x + p.dx, cy = p.y + p.dy;
        if (canMove(map, cx, cy)) np = { ...np, x: cx, y: cy };
      }
      // Tunnel wrap
      if (np.x < 0) np.x = COLS - 1;
      if (np.x >= COLS) np.x = 0;

      // Check zone collision
      const cell = map[np.y]?.[np.x];
      const isAnswerZone = [2, 3, 4, 5].includes(cell);

      if (isAnswerZone && !az.has(`${np.x},${np.y}`)) {
        const optIdx = zoneToOptIdx[cell];
        const isCorrect = optIdx === QUESTIONS[qi % QUESTIONS.length].correct;
        const newAz = new Set(az);
        // Mark all cells of this zone type as answered
        for (let y = 0; y < ROWS; y++)
          for (let x = 0; x < COLS; x++)
            if (map[y][x] === cell) newAz.add(`${x},${y}`);

        const newScore = isCorrect ? sc + 200 : sc;
        const newLives = isCorrect ? lv : lv - 1;
        const newCredits = isCorrect ? cr + 1 : cr;

        setPlayer(np);
        setGhosts(gs);
        setAnsweredZones(newAz);
        setScore(newScore);
        setFeedback({ correct: isCorrect, zone: cell, x: np.x, y: np.y });
        setGameState("feedback");

        if (newLives <= 0) {
          setTimeout(() => { setLives(0); setGameState("gameover"); setFeedback(null); }, 1200);
        } else {
          setLives(newLives);
          setCredits(newCredits);
          setTimeout(() => {
            setFeedback(null);
            if (isCorrect) {
              // Next question
              const nextQi = qi + 1;
              setQIdx(nextQi);
              setAnsweredZones(new Set());
              if (nextQi >= QUESTIONS.length) {
                setGameState("win");
              } else {
                setGameState("question");
              }
            } else {
              setGameState("playing");
            }
          }, 1200);
        }
        return;
      }

      // Ghost movement every 2 ticks
      let newGhosts = gs;
      if (tickRef.current % 2 === 0) {
        newGhosts = gs.map(g => ghostAI(g, np, map));
      }

      // Ghost collision
      let died = false;
      newGhosts.forEach(g => {
        if (g.x === np.x && g.y === np.y) died = true;
      });

      if (died) {
        const newLv = lv - 1;
        setLives(newLv);
        setPlayer({ x: 9, y: 8, dx: 1, dy: 0, mouth: 0 });
        setGhosts(GHOST_CONFIGS.map(g => ({ ...g, scared: false })));
        if (newLv <= 0) setGameState("gameover");
        else {
          setGameState("dead");
          setTimeout(() => setGameState("playing"), 1500);
        }
        return;
      }

      setPlayer(np);
      setGhosts(newGhosts);
    }, 140);
    return () => clearInterval(interval);
  }, [gameState, map]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = COLS * CS, H = ROWS * CS;

    ctx.fillStyle = "#07071a";
    ctx.fillRect(0, 0, W, H);

    // Draw cells
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = map[y][x];
        const px = x * CS, py = y * CS;
        const answered = answeredZones.has(`${x},${y}`);

        if (cell === 0) {
          ctx.fillStyle = "#09091f";
          ctx.fillRect(px, py, CS, CS);
          ctx.strokeStyle = "#1a1a4e";
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, CS - 1, CS - 1);
          // Neon pipe walls - draw neon borders toward open neighbors
          const neighbors = [
            {dx:0,dy:-1}, {dx:0,dy:1}, {dx:-1,dy:0}, {dx:1,dy:0}
          ];
          neighbors.forEach(({dx, dy}) => {
            const nx = x + dx, ny = y + dy;
            const neighborCell = ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS ? map[ny][nx] : 0;
            if (neighborCell !== 0) {
              // Draw neon pipe border on this face
              ctx.strokeStyle = "#00e5ff";
              ctx.shadowColor = "#00e5ff";
              ctx.shadowBlur = 8;
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              if (dy === -1) { ctx.moveTo(px + 2, py); ctx.lineTo(px + CS - 2, py); }
              if (dy === 1)  { ctx.moveTo(px + 2, py + CS); ctx.lineTo(px + CS - 2, py + CS); }
              if (dx === -1) { ctx.moveTo(px, py + 2); ctx.lineTo(px, py + CS - 2); }
              if (dx === 1)  { ctx.moveTo(px + CS, py + 2); ctx.lineTo(px + CS, py + CS - 2); }
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          });
        } else if ([2, 3, 4, 5].includes(cell)) {
          const zc = ZONE_COLORS[cell];
          if (answered) {
            ctx.fillStyle = "rgba(20,20,60,0.6)";
          } else {
            ctx.fillStyle = zc.bg;
          }
          ctx.fillRect(px, py, CS, CS);
          if (!answered) {
            ctx.strokeStyle = zc.border;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = zc.border;
            ctx.shadowBlur = 10;
            ctx.strokeRect(px + 1, py + 1, CS - 2, CS - 2);
            ctx.shadowBlur = 0;
          }
        } else {
          // Path
          ctx.fillStyle = "#0c0c28";
          ctx.fillRect(px, py, CS, CS);
        }
      }
    }

    // Draw answer zone labels (show option text centered in each zone cluster)
    const zoneDrawn = new Set();
    const zoneGroups = {};
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = map[y][x];
        if ([2,3,4,5].includes(cell)) {
          if (!zoneGroups[cell]) zoneGroups[cell] = [];
          zoneGroups[cell].push({x, y});
        }
      }
    }

    Object.entries(zoneGroups).forEach(([cellType, cells]) => {
      const ct = parseInt(cellType);
      if (answeredZones.has(`${cells[0].x},${cells[0].y}`)) return;
      const zc = ZONE_COLORS[ct];
      const optIdx = zoneToOptIdx[ct];
      const optText = currentQ.opts[optIdx] || "";
      const label = ZONE_LABELS[ct];
      const minX = Math.min(...cells.map(c => c.x));
      const maxX = Math.max(...cells.map(c => c.x));
      const minY = Math.min(...cells.map(c => c.y));
      const maxY = Math.max(...cells.map(c => c.y));
      const cx2 = (minX + maxX + 1) / 2 * CS;
      const cy2 = (minY + maxY + 1) / 2 * CS;

      // Label letter
      ctx.fillStyle = zc.text;
      ctx.shadowColor = zc.text;
      ctx.shadowBlur = 12;
      ctx.font = "bold 11px 'Courier New'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, cx2, cy2 - 10);

      // Option text - wrap if needed
      ctx.font = "bold 9px 'Courier New'";
      ctx.shadowBlur = 6;
      const words = optText.split(" ");
      let lines = [];
      let line = "";
      const maxW = (maxX - minX + 1) * CS - 8;
      words.forEach(word => {
        const test = line ? line + " " + word : word;
        const tw = ctx.measureText(test).width;
        if (tw > maxW && line) { lines.push(line); line = word; }
        else line = test;
      });
      if (line) lines.push(line);
      lines.forEach((l, i) => {
        ctx.fillText(l, cx2, cy2 + 4 + i * 12);
      });
      ctx.shadowBlur = 0;
    });

    // Draw player
    const px2 = player.x * CS + CS / 2;
    const py2 = player.y * CS + CS / 2;
    const mA = (player.mouth / 8) * 0.45;
    const angle = Math.atan2(player.dy, player.dx);
    ctx.fillStyle = "#ffd700";
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(px2, py2);
    ctx.arc(px2, py2, CS / 2 - 3, angle + mA, angle + Math.PI * 2 - mA);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw ghosts
    ghosts.forEach(g => {
      const gx = g.x * CS + CS / 2;
      const gy = g.y * CS + CS / 2;
      const color = g.scared ? g.scaredColor : g.color;
      const r = CS / 2 - 3;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(gx, gy - 2, r, Math.PI, 0);
      const base = gy + r;
      ctx.lineTo(gx + r, base);
      const seg = (r * 2) / 3;
      ctx.quadraticCurveTo(gx + r - seg * 0.5, base + 7, gx + r - seg, base);
      ctx.quadraticCurveTo(gx + r - seg * 1.5, base - 7, gx + r - seg * 2, base);
      ctx.quadraticCurveTo(gx - r + 0.5, base + 7, gx - r, base);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      if (!g.scared) {
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.ellipse(gx - 4, gy - 4, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(gx + 4, gy - 4, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0033cc";
        ctx.beginPath(); ctx.arc(gx - 4 + g.dx, gy - 4 + g.dy, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(gx + 4 + g.dx, gy - 4 + g.dy, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    });

    // Feedback overlay on canvas
    if (feedback) {
      const fx = feedback.x * CS + CS / 2;
      const fy = feedback.y * CS + CS / 2;
      const sym = feedback.correct ? "✓" : "✗";
      const col = feedback.correct ? "#00ff88" : "#ff3333";
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 30;
      ctx.font = "bold 36px 'Courier New'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sym, fx, fy - 10);
      ctx.shadowBlur = 0;
    }
  }, [player, ghosts, answeredZones, feedback, currentQ, map]);

  const W = COLS * CS;
  const H = ROWS * CS;

  const resetGame = () => {
    setPlayer({ x: 9, y: 8, dx: 1, dy: 0, mouth: 0 });
    setGhosts(GHOST_CONFIGS.map(g => ({ ...g, scared: false })));
    setScore(0); setLives(3); setCredits(0); setQIdx(0);
    setAnsweredZones(new Set()); setFeedback(null);
    setInputDir({ dx: 1, dy: 0 });
    setGameState("question");
  };

  const startPlaying = () => setGameState("playing");

  const DPAD = [
    [null, "up", null],
    ["left", null, "right"],
    [null, "down", null],
  ];
  const dpadDir = { up:{dx:0,dy:-1}, down:{dx:0,dy:1}, left:{dx:-1,dy:0}, right:{dx:1,dy:0} };
  const dpadIcon = { up:"▲", down:"▼", left:"◀", right:"▶" };
  // --- KODE BARU: MENYIMPAN SKOR KE DATABASE ---
  useEffect(() => {
    const saveScore = async () => {
      // Hanya simpan jika game selesai (menang atau kalah) dan skor > 0
      if ((gameState === "win" || gameState === "gameover") && score > 0) {
        
        // Untuk sementara kita gunakan NISN Kiel (51425313) yang sudah kita buat sebelumnya
        const nisnPemain = "51425313"; 

        const { error } = await supabase
          .from('score_history')
          .insert([
            { 
              nisn: nisnPemain, 
              mata_pelajaran: 'IPA', 
              skor: score 
            }
          ]);

        if (error) {
          console.error("Gagal menyimpan skor:", error);
        } else {
          console.log("Skor berhasil diamankan ke database!");
        }
      }
    };

    saveScore();
  }, [gameState, score]); // Fungsi ini akan terpanggil otomatis setiap gameState berubah
  // ---------------------------------------------
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0014 0%, #07071a 50%, #0d0a20 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      padding: "12px",
      userSelect: "none",
    }}>
      <style>{`
        @keyframes glow-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes pop-in { 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes neon-flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.4} 94%{opacity:1} 96%{opacity:0.6} 97%{opacity:1} }
        .neon-title { animation: neon-flicker 4s infinite; }
        .question-box { animation: pop-in 0.3s ease-out; }
      `}</style>

      {/* Arcade header */}
      <div style={{ display:"flex", justifyContent:"space-between", width: W + 8, marginBottom: 6 }}>
        <div style={{ background:"rgba(0,229,255,0.15)", border:"1px solid #00e5ff", borderRadius:3, padding:"3px 14px", color:"#00e5ff", fontSize:11, letterSpacing:3, textShadow:"0 0 10px #00e5ff" }}>ARCADE</div>
        <div style={{ background:"rgba(255,77,166,0.15)", border:"1px solid #ff4da6", borderRadius:3, padding:"3px 14px", color:"#ff4da6", fontSize:11, letterSpacing:3, textShadow:"0 0 10px #ff4da6" }}>RAMEN</div>
      </div>

      {/* HUD */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        width: W + 8, marginBottom: 6,
        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(0,229,255,0.3)",
        borderRadius: 4, padding:"5px 12px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Player avatar */}
          <div style={{ width:26, height:26, borderRadius:"50%", background:"#2a1a3e", border:"1px solid #b967ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</div>
          <span style={{ color:"#e0d0ff", fontSize:12 }}>Player: <span style={{color:"#fff",fontWeight:"bold"}}>Kiel</span></span>
        </div>
        <div style={{ color:"#00e5ff", fontSize:11 }}>CREDITS: <span style={{color:"#fff"}}>{credits}</span></div>
        <div style={{ color:"#b967ff", fontSize:11 }}>LEVEL: <span style={{color:"#fff"}}>{qIdx + 1}/{QUESTIONS.length}</span></div>
        <div style={{ color:"#ff4da6", fontSize:13 }}>
          {Array.from({length:3}).map((_,i) => (
            <span key={i} style={{opacity: i < lives ? 1 : 0.15, textShadow: i < lives ? "0 0 8px #ff4da6":""}}> ♥</span>
          ))}
        </div>
        <div style={{ fontSize:14, cursor:"pointer", color:"#888" }}>⚙</div>
      </div>

      {/* Game area */}
      <div style={{ position:"relative", border:"2px solid #b967ff", boxShadow:"0 0 24px #b967ff, 0 0 48px rgba(185,103,255,0.2), inset 0 0 30px rgba(0,0,0,0.7)", borderRadius:3 }}>
        {/* Inner neon frame */}
        <div style={{ position:"absolute", top:4, left:4, right:4, bottom:4, border:"1px solid rgba(0,229,255,0.3)", borderRadius:2, pointerEvents:"none", zIndex:10 }} />

        <canvas ref={canvasRef} width={W} height={H} style={{ display:"block", borderRadius:2 }} />

        {/* Question display bar at top of maze */}
        {(gameState === "playing" || gameState === "dead") && (
          <div style={{
            position:"absolute", top:8, left:8, right:8,
            background:"rgba(7,7,26,0.88)",
            border:"1px solid rgba(0,229,255,0.5)",
            borderRadius:3, padding:"6px 12px",
            color:"#e0eeff", fontSize:11, textAlign:"center",
            lineHeight:1.5, zIndex:20,
            boxShadow:"0 0 12px rgba(0,229,255,0.2)",
          }}>
            <div style={{color:"#00e5ff", fontSize:10, letterSpacing:2, marginBottom:3}}>SOAL {qIdx+1}</div>
            {currentQ.q}
          </div>
        )}

        {/* Question modal */}
        {gameState === "question" && (
          <div className="question-box" style={{
            position:"absolute", top:0, left:0, width:"100%", height:"100%",
            background:"rgba(7,7,26,0.93)", display:"flex",
            flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:16, zIndex:30, borderRadius:2,
          }}>
            <div style={{ color:"#00e5ff", fontSize:10, letterSpacing:4, textShadow:"0 0 10px #00e5ff" }}>⚡ SOAL {qIdx+1} / {QUESTIONS.length} ⚡</div>
            <div style={{
              color:"#fff", fontSize:16, fontWeight:"bold", textAlign:"center",
              maxWidth:420, padding:"16px 20px", lineHeight:1.6,
              border:"1px solid rgba(0,229,255,0.5)", borderRadius:4,
              background:"rgba(0,229,255,0.05)", boxShadow:"0 0 20px rgba(0,229,255,0.15)",
            }}>{currentQ.q}</div>
            <div style={{ color:"#888", fontSize:11, textAlign:"center", lineHeight:1.8 }}>
              {currentQ.opts.map((opt, i) => {
                const zoneType = [2,3,4,5][i];
                const zc = ZONE_COLORS[zoneType];
                return (
                  <div key={i} style={{ marginBottom:4 }}>
                    <span style={{ color:zc.text, textShadow:`0 0 8px ${zc.text}` }}>{ZONE_LABELS[zoneType]}</span>
                    <span style={{ color:"#aaa" }}> → {opt}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ color:"#555", fontSize:10, letterSpacing:1, marginTop:4 }}>Cari zona jawaban yang benar di dalam maze!</div>
            <button onClick={startPlaying} style={{
              padding:"10px 30px", background:"transparent",
              border:"2px solid #b967ff", color:"#b967ff", fontSize:13,
              fontFamily:"'Courier New', monospace", cursor:"pointer",
              borderRadius:3, textShadow:"0 0 10px #b967ff",
              boxShadow:"0 0 12px rgba(185,103,255,0.3)",
            }}>▶ MULAI</button>
          </div>
        )}

        {/* Feedback overlay */}
        {gameState === "feedback" && feedback && (
          <div style={{
            position:"absolute", top:0, left:0, width:"100%", height:"100%",
            background: feedback.correct ? "rgba(0,255,100,0.08)" : "rgba(255,0,0,0.08)",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:12, zIndex:30, animation: feedback.correct ? "" : "shake 0.4s ease",
          }}>
            <div style={{
              fontSize:72, lineHeight:1,
              color: feedback.correct ? "#00ff88" : "#ff3333",
              textShadow: feedback.correct ? "0 0 40px #00ff88, 0 0 80px #00ff88" : "0 0 40px #ff3333, 0 0 80px #ff3333",
              animation: "pop-in 0.3s ease-out",
            }}>
              {feedback.correct ? "✓" : "✗"}
            </div>
            <div style={{
              color: feedback.correct ? "#00ff88" : "#ff3333",
              fontSize:18, fontWeight:"bold",
              textShadow: feedback.correct ? "0 0 15px #00ff88" : "0 0 15px #ff3333",
            }}>
              {feedback.correct ? "BENAR! +200" : "SALAH! -1 NYAWA"}
            </div>
            {!feedback.correct && (
              <div style={{ color:"#aaa", fontSize:11 }}>
                Jawaban: <span style={{color:"#ffd700"}}>{currentQ.opts[currentQ.correct]}</span>
              </div>
            )}
          </div>
        )}

        {/* Dead flash */}
        {gameState === "dead" && (
          <div style={{
            position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)",
            color:"#ff4da6", fontSize:22, fontWeight:"bold",
            textShadow:"0 0 20px #ff4da6", zIndex:30, animation:"shake 0.4s ease",
          }}>💀 -1 NYAWA</div>
        )}

        {/* Win screen */}
        {gameState === "win" && (
          <div style={{
            position:"absolute", top:0, left:0, width:"100%", height:"100%",
            background:"rgba(7,7,26,0.95)", display:"flex",
            flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:18, zIndex:30,
          }}>
            <div style={{ fontSize:48 }}>🏆</div>
            <div style={{ color:"#ffd700", fontSize:26, fontWeight:"bold", textShadow:"0 0 20px #ffd700" }}>KAMU MENANG!</div>
            <div style={{ color:"#00e5ff", fontSize:14 }}>Semua soal IPA selesai!</div>
            <div style={{ color:"#b967ff", fontSize:18 }}>Skor: <span style={{color:"#fff"}}>{score}</span></div>
            <button onClick={resetGame} style={{
              padding:"10px 28px", background:"transparent",
              border:"2px solid #ffd700", color:"#ffd700", fontSize:13,
              fontFamily:"'Courier New', monospace", cursor:"pointer",
              borderRadius:3, textShadow:"0 0 10px #ffd700",
            }}>MAIN LAGI</button>
          </div>
        )}

        {/* Game over screen */}
        {gameState === "gameover" && (
          <div style={{
            position:"absolute", top:0, left:0, width:"100%", height:"100%",
            background:"rgba(7,7,26,0.95)", display:"flex",
            flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:18, zIndex:30,
          }}>
            <div style={{ color:"#ff4da6", fontSize:28, fontWeight:"bold", textShadow:"0 0 20px #ff4da6" }}>GAME OVER</div>
            <div style={{ color:"#ffd700", fontSize:14 }}>Skor: {score}</div>
            <button onClick={resetGame} style={{
              padding:"10px 28px", background:"transparent",
              border:"2px solid #ff4da6", color:"#ff4da6", fontSize:13,
              fontFamily:"'Courier New', monospace", cursor:"pointer",
              borderRadius:3, textShadow:"0 0 10px #ff4da6",
            }}>INSERT COIN</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ color:"rgba(0,229,255,0.35)", fontSize:10, letterSpacing:3, marginTop:8 }}>
        © 2026 MAJOO! — INSERT COIN TO CONTINUE
      </div>

      {/* D-Pad */}
      <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"repeat(3,48px)", gridTemplateRows:"repeat(3,48px)", gap:4 }}>
        {DPAD.map((row, ri) => row.map((key, ci) => key ? (
          <button key={key}
            onTouchStart={e => { e.preventDefault(); setInputDir(dpadDir[key]); }}
            onClick={() => setInputDir(dpadDir[key])}
            style={{
              width:48, height:48, background:"rgba(185,103,255,0.12)",
              border:"1px solid #b967ff", borderRadius:6, color:"#b967ff",
              fontSize:18, cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", boxShadow:"0 0 8px rgba(185,103,255,0.2)",
            }}>{dpadIcon[key]}</button>
        ) : <div key={`e-${ri}-${ci}`} />))}
      </div>

      {/* Legend */}
      <div style={{ marginTop:12, display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
        {[2,3,4,5].map(z => {
          const zc = ZONE_COLORS[z];
          const optIdx = zoneToOptIdx[z];
          return (
            <div key={z} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11 }}>
              <div style={{ width:14, height:14, border:`2px solid ${zc.border}`, borderRadius:2, background:zc.bg, boxShadow:`0 0 6px ${zc.border}` }} />
              <span style={{ color:zc.text }}>{ZONE_LABELS[z]}</span>
              <span style={{ color:"#555" }}>{currentQ?.opts[optIdx] || ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}