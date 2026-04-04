import { useState, useEffect } from "react";

export default function Loader({ label, onCancel }) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ textAlign:"center", padding:"48px 20px" }}>
      <div style={{ display:"inline-block", width:40, height:40, border:"3px solid rgba(255,255,255,0.1)", borderTopColor:"#E63946", borderRadius:"50%", animation:"spin 0.8s linear infinite", marginBottom:16 }} />
      <p style={{ fontSize:15, color:"rgba(255,255,255,0.7)", margin:"0 0 4px" }}>{label}</p>
      <p style={{ fontSize:13, color:"rgba(255,255,255,0.3)", margin:"0 0 16px" }}>{sec}s</p>
      <button onClick={onCancel} style={{ padding:"8px 24px", fontSize:13, color:"rgba(255,255,255,0.5)", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, cursor:"pointer", fontFamily:"inherit" }}>
        Cancelar
      </button>
    </div>
  );
}
