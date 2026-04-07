import { useState } from "react";
import { ST } from "../styles.js";
import { VERBS, PARTICLES, GRAMMAR } from "../constants.js";
import { LEVELS } from "../curriculum.js";
import Badge from "../components/Badge.jsx";

// Level accent colours (matches LCOL in constants)
const LCOL = {"B1":"#ff6b6b","B2":"#ff9f43","B3":"#feca57","B4":"#48dbfb","B5":"#0abde3","B6":"#5f27cd"};
const DARK_TEXT = new Set(["B3","B4"]); // levels where dark text is more readable on the badge

export default function ReferenceTab() {
  const [refSec, setRefSec] = useState("verbs");
  // Which kanji level group is expanded (null = all collapsed)
  const [openKanjiLvl, setOpenKanjiLvl] = useState("B6");

  // Only levels that have kanji
  const kanjiLevels = LEVELS.filter(l => l.kanjiWithMeaning.length > 0);

  return (
    <div style={ST.page}>
      <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 16px" }}>📖 Referência</h2>
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {[["verbs","動 Verbos"],["particles","助 Partículas"],["kanji","漢 Kanji"],["grammar","文 Gramática"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setRefSec(id)} style={{ ...ST.chip, background:refSec===id?"#457B9D":"rgba(255,255,255,0.08)", color:refSec===id?"#fff":"rgba(255,255,255,0.5)", borderColor:refSec===id?"#457B9D":"rgba(255,255,255,0.1)" }}>{lbl}</button>
        ))}
      </div>

      {/* ── VERBOS ── */}
      {refSec === "verbs" && VERBS.map((g, gi) => (
        <div key={gi} style={{ ...ST.card, marginBottom:12 }}>
          <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 4px", color:"#fff" }}>{g.title}</h3>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:"0 0 12px" }}>{g.desc}</p>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead><tr>{["辞書形","ます形","て形","ない形","た形","Sig."].map(h => <th key={h} style={{ padding:"6px 8px", borderBottom:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", fontWeight:600, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
              <tbody>{g.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} style={{ padding:"6px 8px", borderBottom:"1px solid rgba(255,255,255,0.05)", color:ci===5?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.75)", whiteSpace:"nowrap" }}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      ))}

      {/* ── PARTÍCULAS ── */}
      {refSec === "particles" && (
        <div style={ST.card}>
          {PARTICLES.map((p, i) => (
            <div key={i} style={{ padding:"10px 0", borderBottom:i<PARTICLES.length-1?"1px solid rgba(255,255,255,0.06)":"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <span style={{ fontSize:24, fontWeight:700, color:"#457B9D", width:36, textAlign:"center" }}>{p.p}</span>
                <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>{p.u}</span>
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"0 0 0 46px" }}>{p.e}</p>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:"2px 0 0 46px", fontStyle:"italic" }}>{p.t}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── KANJI — real ICBJ lists with meanings ── */}
      {refSec === "kanji" && (
        <>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:"0 0 12px" }}>
            293 kanji do ICBJ Básico 3–6. Toque num nível para expandir.
          </p>
          {kanjiLevels.map(lvl => {
            const open = openKanjiLvl === lvl.id;
            const col = LCOL[lvl.id] || "#888";
            const textCol = DARK_TEXT.has(lvl.id) ? "#1a1a2e" : "#fff";
            return (
              <div key={lvl.id} style={{ ...ST.card, marginBottom:10, padding:0, overflow:"hidden" }}>
                {/* Header — tap to expand/collapse */}
                <button onClick={() => setOpenKanjiLvl(open ? null : lvl.id)}
                  style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:8, background:col, color:textCol }}>{lvl.id}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{lvl.label}</span>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>{lvl.kanjiWithMeaning.length} kanji</span>
                  </div>
                  <span style={{ fontSize:16, color:"rgba(255,255,255,0.4)" }}>{open ? "▲" : "▼"}</span>
                </button>

                {/* Kanji grid with meanings */}
                {open && (
                  <div style={{ padding:"4px 14px 16px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:10 }}>
                      {lvl.kanjiWithMeaning.map(({ k, m }) => (
                        <div key={k} title={m}
                          style={{ display:"flex", flexDirection:"column", alignItems:"center", width:52, padding:"6px 4px", borderRadius:10,
                            background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", gap:3 }}>
                          <span style={{ fontSize:22, color:"#fff", fontWeight:700, lineHeight:1 }}>{k}</span>
                          <span style={{ fontSize:9, color:"rgba(255,255,255,0.45)", textAlign:"center", lineHeight:1.2, wordBreak:"break-word" }}>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* ── GRAMÁTICA — full ICBJ curriculum ── */}
      {refSec === "grammar" && (() => {
        const byLevel = LEVELS.reduce((acc, l) => {
          const pts = GRAMMAR.filter(g => g.l === l.id);
          if (pts.length) acc.push({ lvl: l, pts });
          return acc;
        }, []);
        return byLevel.map(({ lvl, pts }) => {
          const col = LCOL[lvl.id] || "#888";
          const textCol = DARK_TEXT.has(lvl.id) ? "#1a1a2e" : "#fff";
          return (
            <div key={lvl.id} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:8, background:col, color:textCol }}>{lvl.id}</span>
                <span style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.7)" }}>{lvl.label}</span>
              </div>
              {pts.map((g, i) => (
                <div key={i} style={{ ...ST.card, marginBottom:8 }}>
                  <p style={{ fontSize:15, fontWeight:700, margin:"0 0 4px", color:"#fff" }}>{g.p}</p>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", margin:"0 0 8px" }}>{g.d}</p>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", margin:0, background:"rgba(0,0,0,0.2)", padding:"7px 10px", borderRadius:8, lineHeight:1.6 }}>{g.e}</p>
                </div>
              ))}
            </div>
          );
        });
      })()}
    </div>
  );
}
