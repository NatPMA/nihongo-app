import { useState } from "react";
import { ST } from "../styles.js";
import { VERBS, PARTICLES, KANJI_LVL, GRAMMAR } from "../constants.js";
import Badge from "../components/Badge.jsx";

export default function ReferenceTab() {
  const [refSec, setRefSec] = useState("verbs");

  return (
    <div style={ST.page}>
      <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 16px" }}>📖 Referência</h2>
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {[["verbs","動 Verbos"],["particles","助 Partículas"],["kanji","漢 Kanji"],["grammar","文 Gramática"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setRefSec(id)} style={{ ...ST.chip, background:refSec===id?"#457B9D":"rgba(255,255,255,0.08)", color:refSec===id?"#fff":"rgba(255,255,255,0.5)", borderColor:refSec===id?"#457B9D":"rgba(255,255,255,0.1)" }}>{lbl}</button>
        ))}
      </div>

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

      {refSec === "kanji" && Object.entries(KANJI_LVL).map(([lvl, kanjis]) => (
        <div key={lvl} style={{ ...ST.card, marginBottom:12 }}>
          <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 10px", color:"rgba(255,255,255,0.7)" }}>{lvl}</h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {kanjis.map(k => <span key={k} style={{ width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", fontSize:20, color:"rgba(255,255,255,0.8)" }}>{k}</span>)}
          </div>
        </div>
      ))}

      {refSec === "grammar" && GRAMMAR.map((g, i) => (
        <div key={i} style={{ ...ST.card, marginBottom:10 }}>
          <Badge bg="rgba(69,123,157,0.2)" color="#7fb8d8">{g.l}</Badge>
          <p style={{ fontSize:16, fontWeight:700, margin:"6px 0 4px", color:"#fff" }}>{g.p}</p>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"0 0 6px" }}>{g.d}</p>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", margin:0, background:"rgba(0,0,0,0.2)", padding:"6px 10px", borderRadius:8 }}>{g.e}</p>
        </div>
      ))}
    </div>
  );
}
