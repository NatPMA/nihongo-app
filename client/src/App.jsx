import { useState, useEffect, useCallback } from "react";

import { TABS, EX_SYS, DLG_SYS, FC_SYS } from "./constants.js";
import { ST } from "./styles.js";
import {
  loadData, saveData, getDefaults, resetStreakIfStale, topWeak,
  callAPI, withRetry,
  sanitizeEx, sanitizeDlg, sanitizeFc,
  recMistake, recCorrect, weakPrompt, r2h,
} from "./utils.js";

import HomeTab from "./tabs/HomeTab.jsx";
import DialoguesTab from "./tabs/DialoguesTab.jsx";
import FlashcardsTab from "./tabs/FlashcardsTab.jsx";
import ReviewTab from "./tabs/ReviewTab.jsx";
import ReferenceTab from "./tabs/ReferenceTab.jsx";
import StatsTab from "./tabs/StatsTab.jsx";

export default function App() {
  const [tab, setTab] = useState("home");
  const [app, setApp] = useState(() => loadData());

  // Exercise state
  const [exs, setExs] = useState([]);
  const [exI, setExI] = useState(0);
  const [exSel, setExSel] = useState(null);
  const [exExp, setExExp] = useState(false);
  const [exRes, setExRes] = useState([]);
  const [exScr, setExScr] = useState("setup");
  const [exLoad, setExLoad] = useState(false);
  const [exErr, setExErr] = useState(null);
  const [streak, setStreak] = useState(0);
  const [fCats, setFCats] = useState([]);
  const [fLvl, setFLvl] = useState(null);
  const [typVal, setTypVal] = useState("");
  const [anim, setAnim] = useState(false);

  // Dialogue
  const [dlg, setDlg] = useState(null);
  const [dlgLoad, setDlgLoad] = useState(false);
  const [dlgErr, setDlgErr] = useState(null);
  const [dlgI, setDlgI] = useState(0);
  const [dlgSel, setDlgSel] = useState(null);
  const [dlgExp, setDlgExp] = useState(false);
  const [dlgRes, setDlgRes] = useState([]);
  const [dlgScr, setDlgScr] = useState("setup");
  const [dlgLvl, setDlgLvl] = useState(null); // null = random

  // Flashcard
  const [fcs, setFcs] = useState([]);
  const [fcI, setFcI] = useState(0);
  const [fcFlip, setFcFlip] = useState(false);
  const [fcLoad, setFcLoad] = useState(false);
  const [fcErr, setFcErr] = useState(null);
  const [fcScr, setFcScr] = useState("setup");
  const [fcOk, setFcOk] = useState(0);
  const [fcTot, setFcTot] = useState(0);

  useEffect(() => { saveData(app); }, [app]);

  // Re-check streak whenever the user returns to this tab (e.g. opens app next day)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      setApp(p => ({ ...p, stats: resetStreakIfStale(p.stats) }));
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  function upW(fn) { setApp(p => ({ ...p, weaknesses: fn(p.weaknesses) })); }
  function upStats(fn) { setApp(p => ({ ...p, stats: fn(p.stats) })); }
  function addRev(ex) { setApp(p => ({ ...p, reviewQueue: [...(p.reviewQueue || []), ex].slice(-50) })); }

  const tw = topWeak(app.weaknesses, 6);
  const hasW = tw.length > 0;
  const today = new Date().toLocaleDateString("pt-BR", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const okCount = exRes.filter(Boolean).length;
  const rq = app.reviewQueue || [];
  const stats = app.stats || {};
  const sessions = stats.sessions || [];

  // Flashcard library + SRS due-count (used in setup screen)
  const fcLibrary = app.cardLibrary || [];
  const srsNR = ((app.srs || {}).nextReview || {});
  const _fcNow = new Date();
  const fcDueCount = fcLibrary.filter(c => { const sr = srsNR[c._sid]; return !sr || new Date(sr.next) <= _fcNow; }).length;
  const fcNextDue = fcLibrary.length > 0 && fcDueCount === 0
    ? fcLibrary.map(c => srsNR[c._sid]?.next).filter(Boolean).map(d => new Date(d)).filter(d => d > _fcNow).sort((a,b) => a-b)[0]
    : null;

  /* ── GENERATORS ── */
  const genEx = useCallback(async () => {
    setExLoad(true); setExErr(null); setExs([]); setExI(0); setExSel(null); setExExp(false); setExRes([]); setTypVal("");
    let hint = "";
    if (fCats.length) hint += "\nÊnfase: " + fCats.join(",") + ".";
    if (fLvl) hint += "\nFoco: " + fLvl + ".";
    try {
      const r = await withRetry(() => callAPI(EX_SYS, "8 exercícios variados. 1-2 tipo typing." + hint + weakPrompt(app.weaknesses) + " APENAS JSON."));
      const safe = sanitizeEx(r);
      if (!safe.length) throw new Error("Nenhum exercício válido");
      setExs(safe); setExScr("playing"); setTimeout(() => setAnim(true), 50);
    } catch(e) { setExErr(e.message || "Erro desconhecido"); }
    finally { setExLoad(false); }
  }, [fCats, fLvl, app.weaknesses]);

  const genDlg = useCallback(async () => {
    setDlgLoad(true); setDlgErr(null); setDlg(null); setDlgI(0); setDlgSel(null); setDlgExp(false); setDlgRes([]);
    try {
      const situations = ["restaurante","estação","loja","escola","hotel"];
      const sit = situations[Math.floor(Math.random() * situations.length)];
      // Use chosen level if set, otherwise pick a random one
      const lvl = dlgLvl ? dlgLvl.replace("Básico ", "") : Math.floor(Math.random()*6)+1;
      const r = await withRetry(() => callAPI(DLG_SYS, "Diálogo curto em japonês, 3 falas, 2 perguntas. Situação: " + sit + ". Nível Básico " + lvl + ". APENAS JSON."));
      const safe = sanitizeDlg(r);
      if (!safe || !safe.dialogue || !safe.dialogue.length) throw new Error("Diálogo inválido");
      setDlg(safe); setDlgScr("reading");
    } catch(e) { setDlgErr(e.message || "Erro desconhecido"); }
    finally { setDlgLoad(false); }
  }, [dlgLvl]);

  const genFc = useCallback(async () => {
    setFcLoad(true); setFcErr(null); setFcs([]); setFcI(0); setFcFlip(false); setFcOk(0); setFcTot(0);
    try {
      const now = new Date();
      const srsData = JSON.parse(JSON.stringify(app.srs || { nextReview: {} }));
      if (!srsData.nextReview) srsData.nextReview = {};
      const library = app.cardLibrary || [];

      // Cards already seen whose review date has arrived
      const dueCards = library.filter(c => {
        const sr = srsData.nextReview[c._sid];
        return !sr || new Date(sr.next) <= now;
      });

      let sessionCards;
      if (dueCards.length >= 8) {
        // Full session from due cards — skip API call
        sessionCards = dueCards.slice(0, 8);
      } else {
        // Supplement with freshly generated cards
        const r = await withRetry(() => callAPI(FC_SYS, "8 flashcards variados. APENAS JSON."));
        const safe = sanitizeFc(r);
        if (!safe.length) throw new Error("Nenhum flashcard válido");

        const existingIds = new Set(library.map(c => c._sid));
        const brandNew = [];
        for (const card of safe) {
          card._sid = "fc_" + card.front + "_" + card.category;
          if (!existingIds.has(card._sid)) {
            brandNew.push(card);
            srsData.nextReview[card._sid] = { level: 0, next: now.toISOString() };
          }
        }

        // Persist new cards into the library (cap at 300)
        const updatedLibrary = [...library, ...brandNew].slice(-300);
        setApp(p => ({ ...p, srs: srsData, cardLibrary: updatedLibrary }));

        sessionCards = [...dueCards, ...brandNew].slice(0, 8);

        if (!sessionCards.length) {
          // All generated cards were duplicates and nothing is due yet
          const nextDue = Object.values(srsData.nextReview)
            .map(rec => rec.next).filter(Boolean).sort()[0];
          throw new Error(nextDue
            ? "Ótimo! Todos os cards estão em dia. Volte em " + new Date(nextDue).toLocaleDateString("pt-BR") + "."
            : "Nenhum flashcard disponível");
        }
      }

      setFcs(sessionCards); setFcScr("studying");
    } catch(e) { setFcErr(e.message || "Erro desconhecido"); }
    finally { setFcLoad(false); }
  }, [app.cardLibrary, app.srs, app.weaknesses]);

  /* ── ANSWER HANDLERS ── */
  function answerEx(idx) {
    if (exSel !== null) return;
    const ex = exs[exI]; if (!ex) return;
    setExSel(idx);
    const ok = idx === (ex.correct || 0);
    setExRes(p => [...p, ok]);
    if (ok) { setStreak(s => s+1); upW(w => recCorrect(w, ex)); }
    else { setStreak(0); upW(w => recMistake(w, ex)); addRev(ex); }
    setTimeout(() => setExExp(true), 300);
  }

  function answerTyping() {
    const ex = exs[exI]; if (!ex || !typVal.trim()) return;
    const orig = typVal.trim().toLowerCase(), hira = r2h(orig);
    const acc = (ex.accepted_answers || []).map(a => (a||"").toLowerCase().trim());
    const ct = (ex.options && ex.options[ex.correct]) ? ex.options[ex.correct].toLowerCase().trim() : "";
    const all = [...acc, ct, r2h(ct)].filter(Boolean);
    const ok = all.some(a => a === orig || a === hira || r2h(a) === hira);
    setExSel(ok ? ex.correct : -1);
    setExRes(p => [...p, ok]);
    if (ok) { setStreak(s => s+1); upW(w => recCorrect(w, ex)); }
    else { setStreak(0); upW(w => recMistake(w, ex)); addRev(ex); }
    setTimeout(() => setExExp(true), 300);
  }

  function nextEx() {
    setAnim(false);
    setTimeout(() => {
      if (exI < exs.length - 1) {
        setExI(i => i+1); setExSel(null); setExExp(false); setTypVal("");
        setTimeout(() => setAnim(true), 50);
      } else {
        const ok = exRes.filter(Boolean).length;
        upStats(s => {
          const d = new Date().toISOString().split("T")[0];
          const ss = [...(s.sessions || []), { date: d, correct: ok, total: exs.length }].slice(-100);
          const nd = s.lastSessionDate !== d;
          const yd = new Date(); yd.setDate(yd.getDate()-1);
          const wy = s.lastSessionDate === yd.toISOString().split("T")[0];
          const ds = nd ? ((wy || !s.lastSessionDate) ? (s.dailyStreak||0)+1 : 1) : (s.dailyStreak||1);
          const ch = { ...(s.categoryHistory || {}) };
          exs.forEach((ex, i) => {
            const cat = ex.category || "OUTRO";
            if (!ch[cat]) ch[cat] = { correct: 0, total: 0 };
            ch[cat].total++;
            if (exRes[i]) ch[cat].correct++;
          });
          return { ...s, sessions: ss, dailyStreak: ds, lastSessionDate: d, totalCorrect: (s.totalCorrect||0)+ok, totalAnswered: (s.totalAnswered||0)+exs.length, categoryHistory: ch };
        });
        setExScr("results");
      }
    }, 150);
  }

  function answerFc(ok) {
    const c = fcs[fcI]; if (!c) return;
    const srs = JSON.parse(JSON.stringify(app.srs || { nextReview: {} }));
    if (!srs.nextReview) srs.nextReview = {};
    if (!srs.nextReview[c._sid]) srs.nextReview[c._sid] = { level: 0, next: new Date().toISOString() };
    const card = srs.nextReview[c._sid];
    card.level = ok ? Math.min((card.level||0)+1, 6) : Math.max(0, (card.level||0)-1);
    const days = [0,1,3,7,14,30,60][Math.min(card.level, 6)];
    const nx = new Date(); nx.setDate(nx.getDate()+days); card.next = nx.toISOString();
    setApp(p => ({ ...p, srs }));
    if (!ok) upW(w => recMistake(w, { category:c.category, level:c.level, topic:c.topic, question:c.front }));
    else upW(w => recCorrect(w, { category:c.category, level:c.level, topic:c.topic }));
    if (ok) setFcOk(n => n+1);
    setFcTot(n => n+1);
    setFcFlip(false);
    if (fcI < fcs.length - 1) setTimeout(() => setFcI(i => i+1), 200);
    else setFcScr("done");
  }

  /* ══════════ TAB RENDERING ══════════ */
  function renderTab() {
    switch (tab) {
      case "home":
        return (
          <HomeTab
            exLoad={exLoad} exErr={exErr} exScr={exScr} exs={exs} exI={exI}
            exSel={exSel} exExp={exExp} exRes={exRes} streak={streak}
            fCats={fCats} fLvl={fLvl} typVal={typVal} anim={anim}
            weaknesses={app.weaknesses} today={today} okCount={okCount} hasW={hasW} tw={tw}
            genEx={genEx} setFCats={setFCats} setFLvl={setFLvl} setExScr={setExScr}
            answerEx={answerEx} answerTyping={answerTyping} nextEx={nextEx}
            setTypVal={setTypVal}
            onClearWeaknesses={() => setApp(p => ({ ...p, weaknesses: { categories:{}, levels:{}, topics:{}, history:[] } }))}
          />
        );
      case "dialogues":
        return (
          <DialoguesTab
            dlgLoad={dlgLoad} dlgErr={dlgErr} dlgScr={dlgScr} dlg={dlg}
            dlgI={dlgI} dlgSel={dlgSel} dlgExp={dlgExp} dlgRes={dlgRes}
            dlgLvl={dlgLvl} setDlgLvl={setDlgLvl}
            genDlg={genDlg} setDlgScr={setDlgScr} setDlgI={setDlgI}
            setDlgSel={setDlgSel} setDlgExp={setDlgExp} setDlgRes={setDlgRes}
            upW={upW}
          />
        );
      case "flashcards":
        return (
          <FlashcardsTab
            fcLoad={fcLoad} fcErr={fcErr} fcScr={fcScr} fcs={fcs} fcI={fcI}
            fcFlip={fcFlip} fcOk={fcOk} fcTot={fcTot} srs={app.srs}
            fcLibrary={fcLibrary} fcDueCount={fcDueCount} fcNextDue={fcNextDue}
            genFc={genFc} setFcFlip={setFcFlip} answerFc={answerFc} setFcScr={setFcScr}
          />
        );
      case "review":
        return (
          <ReviewTab
            rq={rq}
            onClear={() => setApp(p => ({ ...p, reviewQueue: [] }))}
          />
        );
      case "reference":
        return <ReferenceTab />;
      case "stats":
        return (
          <StatsTab
            stats={stats} sessions={sessions} hasW={hasW} tw={tw}
            onClearWeaknesses={() => setApp(p => ({ ...p, weaknesses: { categories:{}, levels:{}, topics:{}, history:[] } }))}
            onReset={() => { if (confirm("Resetar tudo?")) setApp(getDefaults()); }}
          />
        );
      default:
        return null;
    }
  }

  /* ══════════ MAIN RETURN ══════════ */
  return (
    <div style={ST.root}>
      <div style={ST.bg} />
      <div style={ST.appC}>
        <div style={ST.scroll}>{renderTab()}</div>
        <div style={ST.tbar}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"6px 8px", cursor:"pointer", fontFamily:"inherit", minWidth:52, color: tab===t.id ? "#E63946" : "rgba(255,255,255,0.3)" }}>
              <span style={{ fontSize:20 }}>{t.icon}</span>
              <span style={{ fontSize:10 }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
