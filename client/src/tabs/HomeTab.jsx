import { ST } from "../styles.js";
import { CATS, LCOL } from "../constants.js";
import { cs } from "../utils.js";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";
import Badge from "../components/Badge.jsx";
import OptionBtn from "../components/OptionBtn.jsx";
import WeakPanel from "../components/WeakPanel.jsx";

export default function HomeTab({
  exLoad, exErr, exScr, exs, exI, exSel, exExp, exRes, streak, fCats, fLvl, typVal, anim,
  weaknesses, today, okCount, hasW, tw,
  genEx, setFCats, setFLvl, setExScr, answerEx, answerTyping, nextEx, setTypVal, onClearWeaknesses,
}) {
  if (exLoad) return <Loader label="Gerando exercícios..." onCancel={() => { genEx._cancel && genEx._cancel(); }} />;

  if (exScr === "playing" && exs.length > 0) {
    const ex = exs[exI];
    if (!ex) return null;
    const cst = cs(ex.category);
    const prog = ((exI+1) / exs.length) * 100;
    const isW = ex.topic && (weaknesses.topics || {})[ex.topic] >= 1;
    const isTyp = ex.type === "typing" || ex.type === "translate";
    const lastOk = exRes.length > 0 ? exRes[exRes.length-1] : null;

    return (
      <div style={ST.page}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <button onClick={() => setExScr("setup")} style={ST.back}>← Voltar</button>
          <div style={{ fontSize:15, fontWeight:700, color:"#feca57", minWidth:50, textAlign:"center" }}>{streak > 0 ? "🔥 "+streak : ""}</div>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{exI+1}/{exs.length}</span>
        </div>
        <div style={ST.pbar}><div style={{ height:"100%", background:"linear-gradient(90deg,#E63946,#ff6b6b)", borderRadius:2, width:prog+"%", transition:"width 0.4s" }} /></div>
        <div style={{ display:"flex", gap:16, justifyContent:"center", fontSize:13, fontWeight:600, marginBottom:14 }}>
          <span style={{ color:"#2ecc71" }}>✓ {okCount}</span>
          <span style={{ color:"#e74c3c" }}>✗ {exRes.length - okCount}</span>
        </div>

        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid "+(isW?"rgba(230,57,70,0.3)":"rgba(255,255,255,0.08)"), borderRadius:16, padding:"20px 18px", opacity:anim?1:0, transform:anim?"translateY(0)":"translateY(20px)", transition:"all 0.35s ease" }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
            <Badge bg={cst.color}>{cst.icon} {cst.label.split(" ")[1]}</Badge>
            <Badge bg={LCOL[ex.level]||"#888"} color={(ex.level==="Básico 3"||ex.level==="Básico 4")?"#1a1a2e":"#fff"}>{ex.level}</Badge>
            <span style={ST.bdgG}>{isTyp?"✏️ Digitação":ex.type==="multiple_choice"?"Múltipla escolha":ex.type==="fill_blank"?"Preencher":ex.type==="translate"?"Tradução":ex.type==="reading"?"Leitura":"Conjugação"}</span>
            {isW && <span style={ST.bdgW}>🎯 Ponto fraco</span>}
          </div>
          {ex.topic && <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", margin:"0 0 10px", fontStyle:"italic" }}>{ex.topic}</p>}
          <div style={ST.qbox}><p style={ST.qtxt}>{ex.question}</p></div>

          {isTyp && exSel === null ? (
            <div>
              <input value={typVal} onChange={e => setTypVal(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&typVal.trim()) answerTyping(); }} placeholder="Digite em japonês ou romaji..." style={ST.tinput} autoFocus />
              <button onClick={answerTyping} disabled={!typVal.trim()} style={{ ...ST.nxt, marginTop:10, opacity:typVal.trim()?1:0.4 }}>Verificar</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {(ex.options||[]).map((o, i) => (
                <OptionBtn key={i} text={o} idx={i} selected={exSel} correctIdx={ex.correct} onClick={() => answerEx(i)} />
              ))}
            </div>
          )}

          {exExp && (() => {
            // Determine the correct answer text to display
            const correctText = isTyp
              ? (ex.accepted_answers && ex.accepted_answers[0]) || (ex.options && ex.options[ex.correct]) || null
              : (ex.options && ex.options[ex.correct]) || null;
            return (
              <div style={{ marginTop:16, padding:"14px 16px", background:"rgba(0,0,0,0.2)", borderRadius:10, borderLeft:"4px solid "+(lastOk?"#2ecc71":"#e74c3c") }}>
                <p style={{ fontSize:15, fontWeight:700, margin:"0 0 8px" }}>{lastOk ? "✓ Correto!" : "✗ Incorreto"}</p>
                {!lastOk && correctText && (
                  <p style={{ fontSize:15, margin:"0 0 8px", color:"#2ecc71", fontFamily:"'Noto Sans JP',sans-serif" }}>
                    ✅ Resposta correta: <strong>{correctText}</strong>
                  </p>
                )}
                <p style={{ fontSize:14, lineHeight:1.6, margin:0, color:"rgba(255,255,255,0.7)" }}>{ex.explanation}</p>
                {!lastOk && <p style={{ fontSize:11, color:"rgba(42,157,143,0.8)", margin:"8px 0 0", fontStyle:"italic" }}>📌 Reforçado nos próximos treinos</p>}
              </div>
            );
          })()}
          {exExp && <button onClick={nextEx} style={ST.nxt}>{exI < exs.length-1 ? "Próximo →" : "Ver Resultado"}</button>}
        </div>
      </div>
    );
  }

  if (exScr === "results") {
    const pct = Math.round((okCount / exs.length) * 100);
    const gr = pct>=90 ? {t:"素晴らしい！",s:"Excelente!",e:"🏆"} : pct>=70 ? {t:"よくできました！",s:"Muito bem!",e:"🎉"} : pct>=50 ? {t:"まあまあ",s:"Razoável",e:"📚"} : {t:"頑張って！",s:"Continue tentando!",e:"💪"};
    const wrongTopics = exs.reduce((acc, ex, i) => { if (!exRes[i] && ex.topic && !acc.includes(ex.topic)) acc.push(ex.topic); return acc; }, []);

    return (
      <div style={ST.page}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <span style={{ fontSize:56 }}>{gr.e}</span>
          <h2 style={{ fontSize:28, fontWeight:800, margin:"8px 0 4px" }}>{gr.t}</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", margin:0 }}>{gr.s}</p>
        </div>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
          <div style={ST.scirc}><span style={{ fontSize:36, fontWeight:800 }}>{pct}%</span><span style={{ fontSize:14, color:"rgba(255,255,255,0.4)" }}>{okCount}/{exs.length}</span></div>
        </div>
        {wrongTopics.length > 0 && (
          <div style={ST.adNote}>
            <p style={{ fontSize:14, fontWeight:700, color:"#2A9D8F", margin:"0 0 6px" }}>🧠 Tópicos reforçados:</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{wrongTopics.map(t => <span key={t} style={ST.adChip}>{t}</span>)}</div>
          </div>
        )}
        {exRes.some(r => !r) && (
          <div style={{ marginBottom:20 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.6)", margin:"0 0 10px" }}>Revisão dos erros:</h3>
            {exs.map((ex, i) => {
              if (exRes[i]) return null;
              const c = cs(ex.category);
              return (
                <div key={i} style={ST.revCard}>
                  <Badge bg={c.color}>{c.icon} {c.label.split(" ")[1]}</Badge>
                  <p style={{ fontSize:13, margin:"6px 0 4px", color:"rgba(255,255,255,0.8)", lineHeight:1.5 }}>{ex.question}</p>
                  <p style={{ fontSize:12, color:"#2ecc71", margin:"0 0 4px" }}>Resposta: <strong>{(ex.options && ex.options[ex.correct]) || "—"}</strong></p>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", margin:0, lineHeight:1.5 }}>{ex.explanation}</p>
                </div>
              );
            })}
          </div>
        )}
        <button onClick={() => { setExScr("setup"); genEx(); }} style={ST.pri}>再 Novo Treino</button>
        <button onClick={() => setExScr("setup")} style={ST.ghost}>Início</button>
      </div>
    );
  }

  // Home setup
  return (
    <div style={ST.page}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={ST.logo}><span style={{ fontSize:36, color:"#fff", fontWeight:700 }}>習</span></div>
        <h1 style={ST.ttl}>日本語 練習</h1>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", margin:"0 0 2px" }}>Exercícios Diários — ICBJ Básico 1〜6</p>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", margin:0, textTransform:"capitalize" }}>{today}</p>
      </div>
      <WeakPanel tw={tw} hasW={hasW} onClear={onClearWeaknesses} />
      <div style={{ marginBottom:20 }}>
        <p style={ST.secLbl}>Foco (opcional):</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
          {Object.entries(CATS).map(([k, v]) => {
            const a = fCats.includes(k);
            return <button key={k} onClick={() => setFCats(p => a ? p.filter(c => c!==k) : [...p, k])} style={{ ...ST.chip, background:a?v.color:"rgba(255,255,255,0.08)", color:a?"#fff":"rgba(255,255,255,0.5)", borderColor:a?v.color:"rgba(255,255,255,0.12)" }}><span style={{ fontSize:15 }}>{v.icon}</span> {v.label.split(" ")[1]}</button>;
          })}
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {[1,2,3,4,5,6].map(n => {
            const l = "Básico "+n, a = fLvl===l;
            return <button key={n} onClick={() => setFLvl(a?null:l)} style={{ ...ST.lvlC, background:a?LCOL[l]:"rgba(255,255,255,0.06)", color:a?"#1a1a2e":"rgba(255,255,255,0.45)", borderColor:a?LCOL[l]:"rgba(255,255,255,0.1)" }}>B{n}</button>;
          })}
        </div>
      </div>
      <button onClick={genEx} style={ST.pri}>{hasW ? "始 Treino Adaptativo" : "始 Começar Treino"}</button>
      {exErr && <ErrorCard message={exErr} onRetry={genEx} />}
    </div>
  );
}
