import { ST } from "../styles.js";
import { LCOL } from "../constants.js";
import { recMistake } from "../utils.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import Badge from "../components/Badge.jsx";
import OptionBtn from "../components/OptionBtn.jsx";

export default function DialoguesTab({
  dlgLoad, dlgErr, dlgScr, dlg, dlgI, dlgSel, dlgExp, dlgRes,
  genDlg, setDlgScr, setDlgI, setDlgSel, setDlgExp, setDlgRes, upW,
}) {
  if (dlgLoad) return <Loader label="Gerando diálogo..." onCancel={() => {}} />;

  if (dlgScr === "reading" && dlg) {
    return (
      <div style={ST.page}>
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
                <p style={{ fontSize:16, margin:"0 0 4px", color:"#f0f0f0", lineHeight:1.6 }}>{l.text}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:"0 0 2px" }}>{l.reading}</p>
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
        <button onClick={() => { setDlgScr("exercises"); setDlgI(0); setDlgSel(null); setDlgExp(false); setDlgRes([]); }} style={ST.pri}>Responder perguntas →</button>
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
        <button onClick={() => { setDlgScr("setup"); genDlg(); }} style={{ ...ST.pri, background:"linear-gradient(135deg,#2A9D8F,#1a8a7f)" }}>話 Novo Diálogo</button>
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
      <button onClick={genDlg} style={{ ...ST.pri, background:"linear-gradient(135deg,#2A9D8F,#1a8a7f)", boxShadow:"0 6px 24px rgba(42,157,143,0.35)" }}>話 Gerar Diálogo</button>
      {dlgErr && <ErrorCard message={dlgErr} onRetry={genDlg} />}
    </div>
  );
}
