import { ST } from "../styles.js";
import { cs } from "../utils.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import Badge from "../components/Badge.jsx";

export default function FlashcardsTab({
  fcLoad, fcErr, fcScr, fcs, fcI, fcFlip, fcOk, fcTot, srs,
  fcLibrary, fcDueCount, fcNextDue,
  genFc, setFcFlip, answerFc, setFcScr,
}) {
  if (fcLoad) return <Loader label="Gerando flashcards..." onCancel={() => {}} />;

  if (fcScr === "studying" && fcs.length > 0 && fcs[fcI]) {
    const fc = fcs[fcI];
    const sl = ((srs || {}).nextReview || {})[fc._sid];
    const slv = sl ? (sl.level || 0) : 0;
    const sLbl = ["Novo","Aprendendo","Jovem","Maduro","Forte","Mestre","Queimado"][slv] || "?";
    const fCst = cs(fc.category);
    return (
      <div style={ST.page}>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textAlign:"center", marginBottom:8 }}>{fcI+1}/{fcs.length}</p>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:6 }}><span style={{ fontSize:11, padding:"2px 10px", borderRadius:8, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)" }}>SRS: {sLbl}</span></div>
        <div onClick={() => setFcFlip(!fcFlip)} style={{ ...ST.card, cursor:"pointer", minHeight:220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", borderColor:fcFlip?"rgba(42,157,143,0.3)":"rgba(255,255,255,0.08)" }}>
          <Badge bg={fCst.color}>{fCst.icon} {fc.category}</Badge>
          {!fcFlip ? (
            <>
              <p style={{ fontSize:32, margin:"12px 0 8px", color:"#fff", fontWeight:700 }}>{fc.front}</p>
              {fc.hint && <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", margin:0 }}>💡 {fc.hint}</p>}
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", margin:"12px 0 0" }}>Toque para virar</p>
            </>
          ) : (
            <>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.4)", margin:"12px 0 4px" }}>{fc.reading}</p>
              <p style={{ fontSize:22, margin:"0 0 8px", color:"#fff", fontWeight:700 }}>{fc.back}</p>
              <p style={{ fontSize:18, color:"rgba(255,255,255,0.5)", margin:0 }}>{fc.front}</p>
            </>
          )}
        </div>
        {fcFlip && (
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <button onClick={() => answerFc(false)} style={{ ...ST.pri, flex:1, background:"linear-gradient(135deg,#e74c3c,#c0392b)", boxShadow:"0 4px 16px rgba(231,76,60,0.3)" }}>✗ Errei</button>
            <button onClick={() => answerFc(true)} style={{ ...ST.pri, flex:1, background:"linear-gradient(135deg,#2ecc71,#27ae60)", boxShadow:"0 4px 16px rgba(46,204,113,0.3)" }}>✓ Acertei</button>
          </div>
        )}
      </div>
    );
  }

  if (fcScr === "done") {
    return (
      <div style={ST.page}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <span style={{ fontSize:48 }}>🧠</span>
          <h3 style={{ fontSize:20, margin:"8px 0" }}>Sessão concluída!</h3>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14 }}>{fcOk}/{fcTot} acertos</p>
        </div>
        <button onClick={() => { setFcScr("setup"); genFc(); }} style={{ ...ST.pri, background:"linear-gradient(135deg,#E9C46A,#d4a843)", color:"#1a1a2e" }}>覚 Nova Sessão</button>
        <button onClick={() => setFcScr("setup")} style={ST.ghost}>Voltar</button>
      </div>
    );
  }

  return (
    <div style={ST.page}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ ...ST.logo, background:"linear-gradient(135deg,#E9C46A,#f4a261)" }}><span style={{ fontSize:36, color:"#1a1a2e" }}>覚</span></div>
        <h2 style={{ fontSize:24, fontWeight:800, margin:"16px 0 4px" }}>Flashcards SRS</h2>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", margin:0 }}>Repetição espaçada</p>
      </div>
      <div style={{ ...ST.card, marginBottom:16 }}>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", margin:0, lineHeight:1.7 }}>Errou → volta em 1 dia. Acertou → 1→3→7→14→30→60 dias.</p>
        {fcLibrary.length > 0 && (
          <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.08)", fontSize:12, color:"rgba(255,255,255,0.4)" }}>
            📚 Biblioteca: {fcLibrary.length} card{fcLibrary.length !== 1 ? "s" : ""}
            {fcDueCount > 0 && <span style={{ color:"#E9C46A", fontWeight:700 }}> · {fcDueCount} para revisar hoje</span>}
            {fcDueCount === 0 && fcNextDue && <span> · Próxima revisão: {fcNextDue.toLocaleDateString("pt-BR")}</span>}
            {fcDueCount === 0 && !fcNextDue && <span style={{ color:"#2ecc71" }}> · Tudo em dia ✓</span>}
          </div>
        )}
      </div>
      <button onClick={genFc} style={{ ...ST.pri, background:"linear-gradient(135deg,#E9C46A,#d4a843)", color:"#1a1a2e", boxShadow:"0 6px 24px rgba(233,196,106,0.35)" }}>
        {fcDueCount >= 8 ? `覚 Revisar Cards (${fcDueCount})` : "覚 Começar Sessão"}
      </button>
      {fcErr && <ErrorCard message={fcErr} onRetry={genFc} />}
    </div>
  );
}
