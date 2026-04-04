/* ══════════ STYLES ══════════ */
export const ST = {
  root: { minHeight:"100vh", background:"linear-gradient(135deg,#0f0c29,#1a1a2e 40%,#16213e)", fontFamily:"'Noto Sans JP','Segoe UI',sans-serif", color:"#e8e8e8", position:"relative" },
  bg: { position:"fixed", inset:0, backgroundImage:"radial-gradient(circle at 20% 80%,rgba(230,57,70,0.06),transparent 50%),radial-gradient(circle at 80% 20%,rgba(69,123,157,0.06),transparent 50%)", pointerEvents:"none" },
  appC: { maxWidth:580, margin:"0 auto", display:"flex", flexDirection:"column", minHeight:"100vh", position:"relative", zIndex:1 },
  scroll: { flex:1, overflowY:"auto", paddingBottom:80 },
  page: { padding:"24px 16px" },
  tbar: { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:580, display:"flex", justifyContent:"space-around", background:"rgba(15,12,41,0.95)", backdropFilter:"blur(12px)", borderTop:"1px solid rgba(255,255,255,0.06)", padding:"6px 0 env(safe-area-inset-bottom,8px)", zIndex:10 },
  logo: { width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#E63946,#ff6b6b)", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:12, boxShadow:"0 8px 32px rgba(230,57,70,0.3)" },
  ttl: { fontSize:28, fontWeight:800, margin:"0 0 4px", background:"linear-gradient(90deg,#fff,#ccc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  card: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"20px 18px" },
  qbox: { background:"rgba(0,0,0,0.2)", borderRadius:10, padding:"16px 14px", marginBottom:16 },
  qtxt: { fontSize:16, lineHeight:1.7, margin:0, color:"#f0f0f0", whiteSpace:"pre-wrap" },
  bdgG: { fontSize:10, padding:"3px 10px", borderRadius:8, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.45)" },
  bdgW: { fontSize:10, padding:"3px 10px", borderRadius:8, background:"rgba(230,57,70,0.15)", color:"#ff8a8a", fontWeight:600 },
  olet: { width:26, height:26, borderRadius:"50%", background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0, color:"rgba(255,255,255,0.45)" },
  tinput: { width:"100%", padding:"14px 16px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, color:"#fff", fontSize:16, fontFamily:"'Noto Sans JP',sans-serif", outline:"none", boxSizing:"border-box" },
  pri: { width:"100%", padding:"14px 20px", fontSize:16, fontWeight:700, color:"#fff", background:"linear-gradient(135deg,#E63946,#d62839)", border:"none", borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:"0 6px 24px rgba(230,57,70,0.35)", fontFamily:"inherit", marginBottom:10 },
  nxt: { marginTop:14, width:"100%", padding:"12px", fontSize:14, fontWeight:700, color:"#fff", background:"linear-gradient(135deg,#457B9D,#2a6f97)", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(69,123,157,0.3)" },
  ghost: { width:"100%", padding:"12px", fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.5)", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, cursor:"pointer", fontFamily:"inherit", marginBottom:8 },
  back: { background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:13, cursor:"pointer", padding:"6px 0", fontFamily:"inherit" },
  pbar: { height:4, background:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:8, overflow:"hidden" },
  wPanel: { background:"rgba(230,57,70,0.06)", border:"1px solid rgba(230,57,70,0.18)", borderRadius:12, padding:"14px 16px", marginBottom:16 },
  clrBtn: { background:"none", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.3)", fontSize:10, padding:"2px 8px", borderRadius:6, cursor:"pointer", fontFamily:"inherit" },
  adNote: { background:"rgba(42,157,143,0.08)", border:"1px solid rgba(42,157,143,0.2)", borderRadius:10, padding:"12px 14px", marginBottom:16 },
  adChip: { fontSize:11, padding:"3px 10px", borderRadius:8, background:"rgba(42,157,143,0.15)", color:"#5de8d5", fontWeight:600 },
  revCard: { background:"rgba(231,76,60,0.06)", border:"1px solid rgba(231,76,60,0.15)", borderRadius:10, padding:"12px 14px", marginBottom:8 },
  scirc: { width:110, height:110, borderRadius:"50%", background:"rgba(255,255,255,0.06)", border:"3px solid rgba(255,255,255,0.15)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" },
  stCard: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"16px", display:"flex", flexDirection:"column", alignItems:"center", gap:4, textAlign:"center" },
  chip: { display:"inline-flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:16, border:"1px solid", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  lvlC: { padding:"4px 10px", borderRadius:12, border:"1px solid", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" },
  secLbl: { fontSize:11, color:"rgba(255,255,255,0.35)", margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.08em" },
};

/* ══════════ GLOBAL STYLES ══════════ */
if (typeof document !== "undefined") {
  const el = document.createElement("style");
  el.textContent = "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800&display=swap');@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}body{margin:0}button:hover{filter:brightness(1.08)}input::placeholder{color:rgba(255,255,255,0.25)}";
  document.head.appendChild(el);
}
