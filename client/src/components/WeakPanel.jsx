import { ST } from "../styles.js";

export default function WeakPanel({ tw, hasW, onClear }) {
  if (!hasW) return null;
  return (
    <div style={ST.wPanel}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:14, fontWeight:700, color:"#ff8a8a" }}>🎯 Seus pontos fracos</span>
        <button onClick={onClear} style={ST.clrBtn}>Limpar</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {tw.map((item, i) => (
          <div key={item[0]} style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:50, height:5, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden", flexShrink:0 }}>
              <div style={{ height:"100%", background:"linear-gradient(90deg,#E63946,#ff6b6b)", borderRadius:3, width: Math.min(100, (item[1]/tw[0][1])*100) + "%", opacity: 1 - i*0.12 }} />
            </div>
            <span style={{ flex:1, fontSize:12, color:"rgba(255,255,255,0.6)" }}>{item[0]}</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600 }}>{Math.round(item[1])}×</span>
          </div>
        ))}
      </div>
    </div>
  );
}
