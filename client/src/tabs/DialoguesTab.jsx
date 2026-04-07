import { useState } from "react";
import { ST } from "../styles.js";
import { LCOL, LCOL as LVL_COLORS } from "../constants.js";
import { recMistake } from "../utils.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import Badge from "../components/Badge.jsx";
import OptionBtn from "../components/OptionBtn.jsx";

export default function DialoguesTab({
  dlgLoad, dlgErr, dlgScr, dlg, dlgI, dlgSel, dlgExp, dlgRes,
  dlgLvl, setDlgLvl,
  genDlg, setDlgScr, setDlgI, setDlgSel, setDlgExp, setDlgRes, upW,
}) {
  const [showFuri, setShowFuri] = useState(false);

  if (dlgLoad) return <Loader label="Gerando diálogo..." onCancel={() => {}} />;

  if (dlgScr === "reading" && dlg) {
    return (
      <div style={ST.page}>
        {/* Header row: back / toggle / proceed */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <button onClick={() => setDlgScr("setup")} style={ST.back}>← Voltar</button>
          <button
            onClick={() => setShowFuri(f => !f)}
            style={{
              padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit", border:"1px solid",
              background: showFuri ? "rgba(42,157,143,0.2)" : "rgba(255,255,255,0.06)",
              color:        showFuri ? "#5de8d5"              : "rgba(255,255,255,0.45)",
              borderColor:  showFuri ? "#2A9D8F"              : "rgba(255,255,255,0.1)",
              transition:"all 0.2s",
            }}>
            あ {showFuri ? "ふりがな ✓" : "ふりがな"}
          </button>
        </div>

        <div style={{ ...ST.card, marginBottom:16 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
            <Badge bg="#2A9D8F">{dlg.situation_jp}</Badge>
            <Badge bg={LCOL[dlg.level]||"#888"}>{dlg.level}</Badge>
          </div>
          <h3 style={{ fontSize:18, fontWeight:700, margin:"0 0 16px", color:"#fff" }}>📍 {dlg.situation}</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {dlg.dialogue.map((l, i) => (
              <div key={i} style={{ background:i%2===0?"rgba(69,123,157,0.1)":"rgba(42,157,143,0.1)", borderRadius:12, padding:"12px 14px", borderLeft:"3px solid "+(i%2===0?"#457B9D":"#2A9D8F") }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:"0 0 4px", fontWeight:600 }}>{l.speaker}</p>
                {/* Reading shown ABOVE the Japanese line when furigana is ON */}
                {showFuri && l.reading && (
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.38)", margin:"0 0 2px", fontFamily:"'Noto Sans JP',sans-serif", letterSpacing:"0.04em", lineHeight:1.5 }}>{l.reading}</p>
                )}
                <p style={{ fontSize:16, margin:"0 0 6px", color:"#f0f0f0", lineHeight:1.6 }}>{l.text}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", margin:0, fontStyle:"italic" }}>{l.translation}</p>
              </div>
            ))}
          </div>
          {dlg.vocabulary && dlg.vocabulary.length > 0 && (
            <div style={{ marginTop:16 }}>
              <p style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.5)", margin:"0 0 8px" }}>📖 Vocabulário:</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {dlg.vocabulary.map((v, i) => <span key={i} style={{ fontSize:12, padding:"4px 10px", borderRadius:8, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)" }}><strong>{v.word}</strong> ({v.reading}) — {v.meaning}</span>)}
              </div>
            </div>
          )}
        </div>
        <button onClick={() => { setDlgScr("exercises"); setDlgI(0); setDlgSel(null); setDlgExp(false); setDlgRes([]); setShowFuri(false); }} style={ST.pri}>Responder perguntas →</button>
      </div>
    );
  }

  if (dlgScr === "exercises" && dlg && dlg.exercises[dlgI]) {
    const dex = dlg.exercises[dlgI];
    const dlgLastOk = dlgRes.length > 0 ? dlgRes[dlgRes.length-1] : null;
    return (
      <div style={ST.page}>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textAlign:"center", marginBottom:8 }}>Pergunta {dlgI+1}/{dlg.exercises.length}</p>
        <div style={ST.card}>
          <div style={ST.qbox}><p style={ST.qtxt}>{dex.question}</p></div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {(dex.options||[]).map((o, i) => (
              <OptionBtn key={i} text={o} idx={i} selected={dlgSel} correctIdx={dex.correct} onClick={() => {
                if (dlgSel !== null) return;
                setDlgSel(i);
                const ok = i === dex.correct;
                setDlgRes(p => [...p, ok]);
                if (!ok) upW(w => recMistake(w, { category:"ESTRUTURA", level:dlg.level, topic:dex.topic||"diálogo", question:dex.question }));
                setTimeout(() => setDlgExp(true), 300);
              }} />
            ))}
          </div>
          {dlgExp && (
            <>
              <div style={{ marginTop:16, padding:"14px 16px", background:"rgba(0,0,0,0.2)", borderRadius:10, borderLeft:"4px solid "+(dlgLastOk?"#2ecc71":"#e74c3c") }}>
                <p style={{ fontSize:14, lineHeight:1.6, margin:0, color:"rgba(255,255,255,0.7)" }}>{dex.explanation}</p>
              </div>
              <button onClick={() => { if (dlgI < dlg.exercises.length-1) { setDlgI(i => i+1); setDlgSel(null); setDlgExp(false); } else { setDlgScr("done"); } }} style={ST.nxt}>{dlgI < dlg.exercises.length-1 ? "Próxima →" : "Concluir"}</button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (dlgScr === "done" && dlg) {
    const dok = dlgRes.filter(Boolean).length;
    return (
      <div style={ST.page}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <span style={{ fontSize:48 }}>{dok === dlg.exercises.length ? "🎉" : "📚"}</span>
          <h3 style={{ fontSize:20, margin:"8px 0" }}>{dok}/{dlg.exercises.length} corretas</h3>
        </div>
        <button onClick={() => { setDlgScr("setup"); setShowFuri(false); genDlg(); }} style={{ ...ST.pri, background:"linear-gradient(135deg,#2A9D8F,#1a8a7f)" }}>話 Novo Diálogo</button>
        <button onClick={() => setDlgScr("setup")} style={ST.ghost}>Voltar</button>
      </div>
    );
  }

  return (
    <div style={ST.page}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ ...ST.logo, background:"linear-gradient(135deg,#2A9D8F,#48dbfb)" }}><span style={{ fontSize:36, color:"#fff" }}>話</span></div>
        <h2 style={{ fontSize:24, fontWeight:800, margin:"16px 0 4px" }}>Mini-Diálogos</h2>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", margin:0 }}>Situações reais do dia a dia</p>
      </div>
      <div style={{ ...ST.card, marginBottom:16 }}><p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", margin:0, lineHeight:1.7 }}>Pratique japonês em contexto! Diálogos situacionais com vocabulário e perguntas.</p></div>

      <div style={{ marginBottom:16 }}>
        <p style={ST.secLbl}>Nível (opcional):</p>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {[1,2,3,4,5,6].map(n => {
            const l = "Básico "+n, active = dlgLvl === l;
            return (
              <button key={n} onClick={() => setDlgLvl(active ? null : l)}
                style={{ ...ST.lvlC, background:active?LVL_COLORS[l]:"rgba(255,255,255,0.06)", color:active?(n===3||n===4?"#1a1a2e":"#fff"):"rgba(255,255,255,0.45)", borderColor:active?LVL_COLORS[l]:"rgba(255,255,255,0.1)" }}>
                B{n}
              </button>
            );
          })}
        </div>
        {dlgLvl && <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", margin:"6px 0 0", fontStyle:"italic" }}>Clique novamente para desmarcar e usar nível aleatório</p>}
      </div>

      <button onClick={genDlg} style={{ ...ST.pri, background:"linear-gradient(135deg,#2A9D8F,#1a8a7f)", boxShadow:"0 6px 24px rgba(42,157,143,0.35)" }}>
        {dlgLvl ? `話 Gerar Diálogo — ${dlgLvl}` : "話 Gerar Diálogo"}
      </button>
      {dlgErr && <ErrorCard message={dlgErr} onRetry={genDlg} />}
    </div>
  );
}
