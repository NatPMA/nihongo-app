import { ST } from "../styles.js";
import { cs } from "../utils.js";
import { LEVELS } from "../curriculum.js";
import WeakPanel from "../components/WeakPanel.jsx";

export default function StatsTab({ stats, sessions, hasW, tw, myLevel, onLevelChange, onClearWeaknesses, onReset }) {
  const ch = stats.categoryHistory || {};
  const last7 = sessions.slice(-7);
  const avg = last7.length ? Math.round(last7.reduce((a, s) => a + (s.correct/s.total)*100, 0) / last7.length) : 0;
  const currentLevel = LEVELS.find(l => l.id === myLevel) || LEVELS[LEVELS.length - 1];

  return (
    <div style={ST.page}>
      <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 20px" }}>📊 Progresso</h2>

      {/* ── MEU NÍVEL ── */}
      <div style={{ ...ST.card, marginBottom:16 }}>
        <p style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.7)", margin:"0 0 10px" }}>🎓 Meu nível ICBJ</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
          {LEVELS.map(l => {
            const active = l.id === myLevel;
            const colors = {"B1":"#ff6b6b","B2":"#ff9f43","B3":"#feca57","B4":"#48dbfb","B5":"#0abde3","B6":"#5f27cd"};
            const col = colors[l.id] || "#888";
            return (
              <button key={l.id} onClick={() => onLevelChange(l.id)}
                style={{ padding:"6px 14px", borderRadius:12, border:"1px solid", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                  background: active ? col : "rgba(255,255,255,0.06)",
                  color: active ? (l.id==="B3"||l.id==="B4" ? "#1a1a2e" : "#fff") : "rgba(255,255,255,0.45)",
                  borderColor: active ? col : "rgba(255,255,255,0.1)" }}>
                {l.id}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:0 }}>
          Treino cobre <strong style={{color:"rgba(255,255,255,0.6)"}}>{currentLevel.label}</strong> + nível anterior (70%) e revisão B1–{LEVELS[LEVELS.findIndex(l=>l.id===myLevel)-2]?.id || "B1"} (30%)
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        <div style={ST.stCard}><span style={{ fontSize:28, fontWeight:800 }}>{stats.dailyStreak || 0}</span><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>🔥 Dias seguidos</span></div>
        <div style={ST.stCard}><span style={{ fontSize:28, fontWeight:800 }}>{sessions.length}</span><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>📝 Sessões</span></div>
        <div style={ST.stCard}><span style={{ fontSize:28, fontWeight:800 }}>{stats.totalCorrect || 0}</span><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>✓ Acertos</span></div>
        <div style={ST.stCard}><span style={{ fontSize:28, fontWeight:800 }}>{avg}%</span><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>📈 Média 7 últ.</span></div>
      </div>

      {Object.keys(ch).length > 0 && (
        <div style={{ ...ST.card, marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 12px", color:"rgba(255,255,255,0.7)" }}>Por categoria</h3>
          {Object.entries(ch).map(([cat, d]) => {
            const c = cs(cat);
            const pct = d.total ? Math.round((d.correct/d.total)*100) : 0;
            return (
              <div key={cat} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>{c.icon} {c.label.split(" ")[1]}</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{pct}% ({d.correct}/{d.total})</span>
                </div>
                <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:pct+"%", background:c.color, borderRadius:3 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sessions.length > 0 && (
        <div style={{ ...ST.card, marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 12px", color:"rgba(255,255,255,0.7)" }}>Últimas sessões</h3>
          <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:80 }}>
            {sessions.slice(-14).map((s, i) => {
              const p = s.total ? (s.correct/s.total)*100 : 0;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                  <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{Math.round(p)}%</span>
                  <div style={{ width:"100%", height:Math.max(4, p*0.7)+"px", background:p>=80?"#2ecc71":p>=50?"#E9C46A":"#e74c3c", borderRadius:2 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <WeakPanel tw={tw} hasW={hasW} onClear={onClearWeaknesses} />
      <button onClick={onReset} style={{ ...ST.ghost, marginTop:8, fontSize:12, color:"rgba(255,255,255,0.25)" }}>Resetar tudo</button>
    </div>
  );
}
