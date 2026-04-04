import { ST } from "../styles.js";

export default function OptionBtn({ text, idx, selected, correctIdx, onClick }) {
  const answered = selected !== null;
  const isSel = selected === idx;
  const isCorr = idx === correctIdx;
  let bg = "rgba(255,255,255,0.04)", bc = "rgba(255,255,255,0.1)", col = "#e0e0e0", td = "none";
  if (answered && isCorr) { bg = "rgba(46,204,113,0.15)"; bc = "#2ecc71"; col = "#2ecc71"; }
  if (answered && isSel && !isCorr) { bg = "rgba(231,76,60,0.15)"; bc = "#e74c3c"; col = "#e74c3c"; td = "line-through"; }
  return (
    <button onClick={onClick} disabled={answered} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"12px 14px", background:bg, border:"1px solid "+bc, borderRadius:10, color:col, fontSize:14, textAlign:"left", fontFamily:"inherit", lineHeight:1.5, cursor: answered?"default":"pointer", textDecoration:td }}>
      <span style={ST.olet}>{String.fromCharCode(65+idx)}</span>
      <span style={{ flex:1 }}>{text}</span>
      {answered && isCorr && <span style={{ color:"#2ecc71", fontWeight:700 }}>✓</span>}
      {answered && isSel && !isCorr && <span style={{ color:"#e74c3c", fontWeight:700 }}>✗</span>}
    </button>
  );
}
