export default function ErrorCard({ message, onRetry }) {
  // "Ótimo!" prefix means it's an informational success, not a real error
  const isInfo = message.startsWith("Ótimo");
  return (
    <div style={{ background: isInfo ? "rgba(46,204,113,0.08)" : "rgba(231,76,60,0.08)", border: "1px solid " + (isInfo ? "rgba(46,204,113,0.25)" : "rgba(231,76,60,0.25)"), borderRadius:14, padding:"20px 18px", textAlign:"center", marginTop:12 }}>
      <span style={{ fontSize:30 }}>{isInfo ? "✅" : "⚠️"}</span>
      <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", margin:"10px 0 " + (onRetry && !isInfo ? "16px" : "0"), lineHeight:1.6 }}>{message}</p>
      {onRetry && !isInfo && (
        <button onClick={onRetry} style={{ padding:"10px 28px", fontSize:14, fontWeight:700, color:"#fff", background:"linear-gradient(135deg,#E63946,#d62839)", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(230,57,70,0.3)" }}>
          ↺ Tentar novamente
        </button>
      )}
    </div>
  );
}
