import { ST } from "../styles.js";
import { cs } from "../utils.js";
import Badge from "../components/Badge.jsx";

export default function ReviewTab({ rq, onClear }) {
  return (
    <div style={ST.page}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ ...ST.logo, background:"linear-gradient(135deg,#e74c3c,#ff6b6b)" }}><span style={{ fontSize:36, color:"#fff" }}>復</span></div>
        <h2 style={{ fontSize:24, fontWeight:800, margin:"16px 0 4px" }}>Revisão Rápida</h2>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", margin:0 }}>Exercícios que você errou</p>
      </div>
      {rq.length === 0 ? (
        <div style={{ ...ST.card, textAlign:"center", padding:32 }}>
          <span style={{ fontSize:40 }}>✨</span>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.5)", marginTop:12 }}>Nenhum erro para revisar!</p>
        </div>
      ) : (
        <>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", margin:"0 0 12px" }}>{rq.length} para revisar:</p>
          {[...rq].reverse().map((ex, i) => {
            const c = cs(ex.category);
            return (
              <div key={i} style={ST.revCard}>
                <Badge bg={c.color}>{c.icon} {c.label.split(" ")[1]}</Badge>
                <p style={{ fontSize:13, margin:"6px 0 4px", color:"rgba(255,255,255,0.75)", lineHeight:1.5 }}>{ex.question}</p>
                <p style={{ fontSize:12, color:"#2ecc71", margin:"0 0 4px" }}>✓ {(ex.options && ex.options[ex.correct]) || "—"}</p>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:0, lineHeight:1.5 }}>{ex.explanation}</p>
              </div>
            );
          })}
          <button onClick={onClear} style={{ ...ST.ghost, marginTop:16 }}>Limpar fila</button>
        </>
      )}
    </div>
  );
}
