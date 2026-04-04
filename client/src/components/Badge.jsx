export default function Badge({ bg, color, children }) {
  return <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:8, color: color || "#fff", background: bg || "#888" }}>{children}</span>;
}
