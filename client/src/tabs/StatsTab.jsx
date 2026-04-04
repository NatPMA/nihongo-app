import { ST } from "../styles.js";
import { cs, getDefaults } from "../utils.js";
import WeakPanel from "../components/WeakPanel.jsx";

export default function StatsTab({ stats, sessions, hasW, tw, onClearWeaknesses, onReset }) {
  const ch = stats.categoryHistory || {};
  const last7 = sessions.slice(-7);
  const avg = last7.length ? Math.round(last7.reduce((a, s) => a + (s.correct/s.total)*100, 0) / last7.length) : 0;

  return (
    <div style={ST.page}>
      <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 20px" }}>📊 Progresso</h2>
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
