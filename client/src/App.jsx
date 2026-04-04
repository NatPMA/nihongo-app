import { useState, useEffect, useCallback } from "react";

/* ══════════ CONSTANTS ══════════ */
const CATS = {
  KANJI: { label: "漢字 Kanji", color: "#E63946", icon: "字" },
  GRAMÁTICA: { label: "文法 Gramática", color: "#457B9D", icon: "文" },
  ESTRUTURA: { label: "構造 Estrutura", color: "#2A9D8F", icon: "構" },
  VOCABULÁRIO: { label: "語彙 Vocabulário", color: "#E9C46A", icon: "語" },
};
const LCOL = { "Básico 1":"#ff6b6b","Básico 2":"#ff9f43","Básico 3":"#feca57","Básico 4":"#48dbfb","Básico 5":"#0abde3","Básico 6":"#5f27cd" };
const TABS = [
  { id:"home", icon:"家", label:"Treino" },
  { id:"dialogues", icon:"話", label:"Diálogos" },
  { id:"flashcards", icon:"覚", label:"Flashcards" },
  { id:"review", icon:"復", label:"Revisão" },
  { id:"reference", icon:"辞", label:"Referência" },
  { id:"stats", icon:"績", label:"Progresso" },
];

/* ══════════ ROMAJI→HIRAGANA ══════════ */
const R2H={"a":"あ","i":"い","u":"う","e":"え","o":"お","ka":"か","ki":"き","ku":"く","ke":"け","ko":"こ","sa":"さ","shi":"し","si":"し","su":"す","se":"せ","so":"そ","ta":"た","chi":"ち","ti":"ち","tsu":"つ","tu":"つ","te":"て","to":"と","na":"な","ni":"に","nu":"ぬ","ne":"ね","no":"の","ha":"は","hi":"ひ","fu":"ふ","hu":"ふ","he":"へ","ho":"ほ","ma":"ま","mi":"み","mu":"む","me":"め","mo":"も","ya":"や","yu":"ゆ","yo":"よ","ra":"ら","ri":"り","ru":"る","re":"れ","ro":"ろ","wa":"わ","wo":"を","n":"ん","nn":"ん","ga":"が","gi":"ぎ","gu":"ぐ","ge":"げ","go":"ご","za":"ざ","ji":"じ","zi":"じ","zu":"ず","ze":"ぜ","zo":"ぞ","da":"だ","di":"ぢ","du":"づ","de":"で","do":"ど","ba":"ば","bi":"び","bu":"ぶ","be":"べ","bo":"ぼ","pa":"ぱ","pi":"ぴ","pu":"ぷ","pe":"ぺ","po":"ぽ","kya":"きゃ","kyu":"きゅ","kyo":"きょ","sha":"しゃ","shu":"しゅ","sho":"しょ","cha":"ちゃ","chu":"ちゅ","cho":"ちょ","nya":"にゃ","nyu":"にゅ","nyo":"にょ","hya":"ひゃ","hyu":"ひゅ","hyo":"ひょ","mya":"みゃ","myu":"みゅ","myo":"みょ","rya":"りゃ","ryu":"りゅ","ryo":"りょ","gya":"ぎゃ","gyu":"ぎゅ","gyo":"ぎょ","ja":"じゃ","ju":"じゅ","jo":"じょ","bya":"びゃ","byu":"びゅ","byo":"びょ","pya":"ぴゃ","pyu":"ぴゅ","pyo":"ぴょ"};
function r2h(input) {
  let r = "", i = 0;
  const s = input.toLowerCase();
  while (i < s.length) {
    if (i+1 < s.length && s[i] === s[i+1] && "bcdfghjklmpqrstvwxyz".includes(s[i])) { r += "っ"; i++; continue; }
    let f = false;
    for (let l = 3; l >= 1; l--) { const c = s.substring(i, i+l); if (R2H[c]) { r += R2H[c]; i += l; f = true; break; } }
    if (!f) { r += s[i]; i++; }
  }
  return r;
}

/* ══════════ PROMPTS ══════════ */
const EX_SYS = `Professor de japonês do ICBJ (Básico 1-6). Gere exercícios em JSON. Sem hiragana/katakana puros.
Cada exercício: id, category (KANJI|GRAMÁTICA|ESTRUTURA|VOCABULÁRIO), level (Básico 1-6), topic (tópico curto), type (multiple_choice|fill_blank|translate|reading|conjugation|typing), question, options (4), correct (0-3), explanation, accepted_answers (array, só typing).
B1-2: partículas は/が/を/に/で, ます形, kanji básico. B3-4: て/た/ない形, ている, たことがある, より. B5-6: potencial, passiva, causativa, たら/ば/なら, keigo.
APENAS array JSON.`;

const DLG_SYS = `Professor de japonês do ICBJ. Gere 1 diálogo curto (3-4 falas) com 2 perguntas.
JSON: {"situation":"nome pt","situation_jp":"jp","level":"Básico 1-6","dialogue":[{"speaker":"A","text":"jp","reading":"hira","translation":"pt"}],"exercises":[{"id":1,"question":"..","options":["A","B","C","D"],"correct":0,"explanation":".."}],"vocabulary":[{"word":"..","reading":"..","meaning":".."}]}
Diálogo CURTO. APENAS JSON, sem texto extra.`;

const FC_SYS = `Professor de japonês do ICBJ. Gere flashcards.
JSON: [{"id":1,"category":"KANJI|VOCABULÁRIO|GRAMÁTICA","level":"Básico X","front":"jp","back":"pt","reading":"hira","topic":"tópico","hint":"dica"}]
APENAS JSON.`;

/* ══════════ API — chama o backend local ══════════ */
async function callAPI(system, userMsg) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, userMsg }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error("Erro " + res.status + ": " + t.substring(0, 120));
    }
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") throw new Error("Tempo esgotado (90s). Tente novamente.");
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/* ══════════ STORAGE ══════════ */
const SKEY = "nihongo-v3";

function getDefaults() {
  return {
    weaknesses: { categories: {}, levels: {}, topics: {}, history: [] },
    srs: { nextReview: {} },
    stats: { sessions: [], dailyStreak: 0, lastSessionDate: null, totalCorrect: 0, totalAnswered: 0, categoryHistory: {} },
    reviewQueue: [],
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(SKEY);
    if (raw) {
      const d = JSON.parse(raw);
      const def = getDefaults();
      return {
        weaknesses: Object.assign({}, def.weaknesses, d.weaknesses || {}),
        srs: Object.assign({ nextReview: {} }, d.srs || {}),
        stats: Object.assign({}, def.stats, d.stats || {}),
        reviewQueue: Array.isArray(d.reviewQueue) ? d.reviewQueue : [],
      };
    }
  } catch (e) { /* ignore */ }
  return getDefaults();
}

function saveData(d) {
  try { localStorage.setItem(SKEY, JSON.stringify(d)); } catch (e) { /* ignore */ }
}

/* ══════════ SANITIZERS ══════════ */
function sanitizeEx(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(e => e && e.question).map((e, i) => {
    const opts = (Array.isArray(e.options) && e.options.length >= 2) ? e.options.map(o => String(o != null ? o : "—")) : ["A","B","C","D"];
    const cor = (typeof e.correct === "number" && e.correct >= 0 && e.correct < opts.length) ? e.correct : 0;
    return {
      id: e.id || i+1, category: e.category || "VOCABULÁRIO", level: e.level || "Básico 1",
      topic: e.topic || "", type: e.type || "multiple_choice", question: e.question,
      options: opts, correct: cor, explanation: e.explanation || "",
      accepted_answers: Array.isArray(e.accepted_answers) ? e.accepted_answers : [],
    };
  });
}

function sanitizeDlg(d) {
  if (!d) return null;
  return {
    situation: d.situation || "Situação",
    situation_jp: d.situation_jp || "場面",
    level: d.level || "Básico 1",
    dialogue: (d.dialogue || []).map(l => ({ speaker: (l && l.speaker) || "?", text: (l && l.text) || "", reading: (l && l.reading) || "", translation: (l && l.translation) || "" })),
    exercises: sanitizeEx(d.exercises || []),
    vocabulary: (d.vocabulary || []).map(v => ({ word: (v && v.word) || "", reading: (v && v.reading) || "", meaning: (v && v.meaning) || "" })),
  };
}

function sanitizeFc(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(c => c && c.front).map((c, i) => ({
    id: c.id || i+1, category: c.category || "VOCABULÁRIO", level: c.level || "Básico 1",
    front: c.front, back: c.back || "?", reading: c.reading || "",
    topic: c.topic || "", hint: c.hint || "",
  }));
}

/* ══════════ WEAKNESS HELPERS ══════════ */
function recMistake(w, ex) {
  const o = JSON.parse(JSON.stringify(w));
  const cat = ex.category || "OUTRO", lvl = ex.level || "?", t = ex.topic || "";
  o.categories[cat] = (o.categories[cat] || 0) + 1;
  o.levels[lvl] = (o.levels[lvl] || 0) + 1;
  if (t) o.topics[t] = (o.topics[t] || 0) + 1;
  o.history.push({ category: cat, level: lvl, topic: t, question: ex.question, date: new Date().toISOString() });
  if (o.history.length > 100) o.history = o.history.slice(-100);
  return o;
}

function recCorrect(w, ex) {
  const o = JSON.parse(JSON.stringify(w));
  const t = ex.topic || "";
  if (t && o.topics[t] > 0) { o.topics[t] = Math.max(0, o.topics[t] - 0.5); if (!o.topics[t]) delete o.topics[t]; }
  const c = ex.category || "";
  if (c && o.categories[c] > 0) { o.categories[c] = Math.max(0, o.categories[c] - 0.3); if (o.categories[c] <= 0) delete o.categories[c]; }
  const l = ex.level || "";
  if (l && o.levels[l] > 0) { o.levels[l] = Math.max(0, o.levels[l] - 0.3); if (o.levels[l] <= 0) delete o.levels[l]; }
  return o;
}

function weakPrompt(w) {
  const tt = Object.entries(w.topics || {}).filter(x => x[1] >= 1).sort((a,b) => b[1]-a[1]).slice(0, 6);
  if (!tt.length) return "";
  return "\n\nPONTOS FRACOS (4-5 dos 10 devem focar neles):\n" + tt.map(x => `- "${x[0]}" (${Math.round(x[1])}x)`).join("\n");
}

function topWeak(w, n) {
  return Object.entries(w.topics || {}).filter(x => x[1] >= 1).sort((a,b) => b[1]-a[1]).slice(0, n || 6);
}

function cs(c) { return CATS[c] || { label: c, color: "#888", icon: "?" }; }

/* ══════════ REFERENCE DATA ══════════ */
const VERBS = [
  { title:"Grupo 1 (五段)", desc:"Terminam em う段", rows:[
    ["書く","書きます","書いて","書かない","書いた","escrever"],
    ["飲む","飲みます","飲んで","飲まない","飲んだ","beber"],
    ["話す","話します","話して","話さない","話した","falar"],
    ["買う","買います","買って","買わない","買った","comprar"],
    ["読む","読みます","読んで","読まない","読んだ","ler"],
  ]},
  { title:"Grupo 2 (一段)", desc:"Terminam em いる/える", rows:[
    ["食べる","食べます","食べて","食べない","食べた","comer"],
    ["見る","見ます","見て","見ない","見た","ver"],
    ["起きる","起きます","起きて","起きない","起きた","acordar"],
  ]},
  { title:"Grupo 3 (不規則)", desc:"する e 来る", rows:[
    ["する","します","して","しない","した","fazer"],
    ["来る","来ます","来て","来ない","来た","vir"],
  ]},
];

const PARTICLES = [
  {p:"は",u:"Tópico",e:"私は学生です。",t:"Eu sou estudante."},
  {p:"が",u:"Sujeito",e:"猫が好きです。",t:"Gosto de gatos."},
  {p:"を",u:"Objeto direto",e:"本を読みます。",t:"Leio livros."},
  {p:"に",u:"Direção/tempo",e:"学校に行きます。",t:"Vou à escola."},
  {p:"で",u:"Local/meio",e:"電車で行きます。",t:"Vou de trem."},
  {p:"へ",u:"Direção",e:"日本へ行きます。",t:"Vou ao Japão."},
  {p:"と",u:"\"e\"/\"com\"",e:"友達と行きます。",t:"Vou com amigo."},
  {p:"も",u:"\"também\"",e:"私も行きます。",t:"Eu também vou."},
  {p:"から",u:"\"de\"/\"porque\"",e:"9時から始まります。",t:"Começa às 9h."},
  {p:"まで",u:"\"até\"",e:"5時まで働きます。",t:"Trabalho até 5h."},
  {p:"の",u:"Posse",e:"私の本です。",t:"É meu livro."},
];

const KANJI_LVL = {
  "Básico 1-2":"一二三四五六七八九十日月年人大小中上下山川田本木水火金土生学校先名何白百千万".split(""),
  "Básico 3-4":"食飲見聞読書話買行来出入立休言思知持住使作走歩開閉教習会待始終送".split(""),
  "Básico 5-6":"動働転運強弱早遅長短高安新古多少広近遠重軽明暗".split(""),
};

const GRAMMAR = [
  {l:"B1-2",p:"～は～です",d:"Identidade",e:"これは本です。"},
  {l:"B1-2",p:"～ます/ません",d:"Forma polida",e:"食べます/食べません"},
  {l:"B3-4",p:"～て形",d:"Conectiva/pedidos",e:"食べて、飲んで"},
  {l:"B3-4",p:"～ている",d:"Progressivo/estado",e:"食べている"},
  {l:"B3-4",p:"～てもいい",d:"Permissão",e:"撮ってもいいですか？"},
  {l:"B3-4",p:"～てはいけない",d:"Proibição",e:"食べてはいけません"},
  {l:"B3-4",p:"～たことがある",d:"Experiência",e:"日本に行ったことがある"},
  {l:"B5-6",p:"～られる",d:"Potencial/passiva",e:"日本語が話せます"},
  {l:"B5-6",p:"～させる",d:"Causativa",e:"野菜を食べさせる"},
  {l:"B5-6",p:"～たら/ば/なら",d:"Condicionais",e:"雨が降ったら行きません"},
];

/* ══════════ LOADING COMPONENT ══════════ */
function Loader({ label, onCancel }) {
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

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════ */

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

  // Flashcard
  const [fcs, setFcs] = useState([]);
  const [fcI, setFcI] = useState(0);
  const [fcFlip, setFcFlip] = useState(false);
  const [fcLoad, setFcLoad] = useState(false);
  const [fcErr, setFcErr] = useState(null);
  const [fcScr, setFcScr] = useState("setup");
  const [fcOk, setFcOk] = useState(0);
  const [fcTot, setFcTot] = useState(0);

  // Reference
  const [refSec, setRefSec] = useState("verbs");

  useEffect(() => { saveData(app); }, [app]);

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

  /* ── GENERATORS ── */
  const genEx = useCallback(async () => {
    setExLoad(true); setExErr(null); setExs([]); setExI(0); setExSel(null); setExExp(false); setExRes([]); setTypVal("");
    let hint = "";
    if (fCats.length) hint += "\nÊnfase: " + fCats.join(",") + ".";
    if (fLvl) hint += "\nFoco: " + fLvl + ".";
    try {
      const r = await callAPI(EX_SYS, "8 exercícios variados. 1-2 tipo typing." + hint + weakPrompt(app.weaknesses) + " APENAS JSON.");
      const safe = sanitizeEx(r);
      if (!safe.length) throw new Error("Nenhum exercício válido");
      setExs(safe); setExScr("playing"); setTimeout(() => setAnim(true), 50);
    } catch(e) { setExErr(e.message || "Erro desconhecido"); }
    finally { setExLoad(false); }
  }, [fCats, fLvl, app.weaknesses]);

  const genDlg = useCallback(async () => {
    setDlgLoad(true); setDlgErr(null); setDlg(null); setDlgI(0); setDlgSel(null); setDlgExp(false); setDlgRes([]);
    try {
      const r = await callAPI(DLG_SYS, "Diálogo curto em japonês, 3 falas, 2 perguntas. Situação: " + ["restaurante","estação","loja","escola","hotel"][Math.floor(Math.random()*5)] + ". Nível Básico " + (Math.floor(Math.random()*6)+1) + ". APENAS JSON.");
      const safe = sanitizeDlg(r);
      if (!safe || !safe.dialogue || !safe.dialogue.length) throw new Error("Diálogo inválido");
      setDlg(safe); setDlgScr("reading");
    } catch(e) { setDlgErr(e.message || "Erro desconhecido"); }
    finally { setDlgLoad(false); }
  }, []);

  const genFc = useCallback(async () => {
    setFcLoad(true); setFcErr(null); setFcs([]); setFcI(0); setFcFlip(false); setFcOk(0); setFcTot(0);
    try {
      const r = await callAPI(FC_SYS, "8 flashcards variados. APENAS JSON.");
      const safe = sanitizeFc(r);
      if (!safe.length) throw new Error("Nenhum flashcard válido");
      const srs = JSON.parse(JSON.stringify(app.srs || { nextReview: {} }));
      if (!srs.nextReview) srs.nextReview = {};
      for (const card of safe) {
        card._sid = "fc_" + card.front + "_" + card.category;
        if (!srs.nextReview[card._sid]) srs.nextReview[card._sid] = { level: 0, next: new Date().toISOString() };
      }
      setApp(p => ({ ...p, srs }));
      setFcs(safe); setFcScr("studying");
    } catch(e) { setFcErr(e.message || "Erro desconhecido"); }
    finally { setFcLoad(false); }
  }, [app.weaknesses, app.srs]);

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

  /* ══════════ RENDER HELPERS ══════════ */

  function WeakPanel() {
    if (!hasW) return null;
    return (
      <div style={ST.wPanel}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <span style={{ fontSize:14, fontWeight:700, color:"#ff8a8a" }}>🎯 Seus pontos fracos</span>
          <button onClick={() => setApp(p => ({ ...p, weaknesses: { categories:{}, levels:{}, topics:{}, history:[] } }))} style={ST.clrBtn}>Limpar</button>
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

  function Badge({ bg, color, children }) {
    return <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:8, color: color || "#fff", background: bg || "#888" }}>{children}</span>;
  }

  function OptionBtn({ text, idx, selected, correctIdx, onClick }) {
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

  /* ══════════ TAB CONTENT ══════════ */

  function renderTab() {
    /* ─── HOME ─── */
    if (tab === "home") {
      if (exLoad) return <Loader label="Gerando exercícios..." onCancel={() => { setExLoad(false); setExErr("Cancelado pelo usuário"); }} />;

      if (exScr === "playing" && exs.length > 0) {
        const ex = exs[exI];
        if (!ex) return null;
        const cst = cs(ex.category);
        const prog = ((exI+1) / exs.length) * 100;
        const isW = ex.topic && (app.weaknesses.topics || {})[ex.topic] >= 1;
        const isTyp = ex.type === "typing";
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
                  <input value={typVal} onChange={e => setTypVal(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&typVal.trim()) answerTyping(); }} placeholder="Romaji ou hiragana..." style={ST.tinput} autoFocus />
                  <button onClick={answerTyping} disabled={!typVal.trim()} style={{ ...ST.nxt, marginTop:10, opacity:typVal.trim()?1:0.4 }}>Verificar</button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(ex.options||[]).map((o, i) => (
                    <OptionBtn key={i} text={o} idx={i} selected={exSel} correctIdx={ex.correct} onClick={() => answerEx(i)} />
                  ))}
                </div>
              )}

              {exExp && (
                <div style={{ marginTop:16, padding:"14px 16px", background:"rgba(0,0,0,0.2)", borderRadius:10, borderLeft:"4px solid "+(lastOk?"#2ecc71":"#e74c3c") }}>
                  <p style={{ fontSize:15, fontWeight:700, margin:"0 0 8px" }}>{lastOk ? "✓ Correto!" : "✗ Incorreto"}</p>
                  <p style={{ fontSize:14, lineHeight:1.6, margin:0, color:"rgba(255,255,255,0.7)" }}>{ex.explanation}</p>
                  {!lastOk && <p style={{ fontSize:11, color:"rgba(42,157,143,0.8)", margin:"8px 0 0", fontStyle:"italic" }}>📌 Reforçado nos próximos treinos</p>}
                </div>
              )}
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
          <WeakPanel />
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
          {exErr && <p style={{ color:"#e74c3c", fontSize:12, textAlign:"center", marginTop:8 }}>{exErr}</p>}
        </div>
      );
    }

    /* ─── DIALOGUES ─── */
    if (tab === "dialogues") {
      if (dlgLoad) return <Loader label="Gerando diálogo..." onCancel={() => { setDlgLoad(false); setDlgErr("Cancelado pelo usuário"); }} />;

      if (dlgScr === "reading" && dlg) {
        return (
          <div style={ST.page}>
            <div style={{ ...ST.card, marginBottom:16 }}>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                <Badge bg="#2A9D8F">{dlg.situation_jp}</Badge>
                <Badge bg={LCOL[dlg.level]||"#888"}>{dlg.level}</Badge>
              </div>
              <h3 style={{ fontSize:18, fontWeight:700, margin:"0 0 16px", color:"#fff" }}>📍 {dlg.situation}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {dlg.dialogue.map((l, i) => (
                  <div key={i} style={{ background:i%2===0?"rgba(69,123,157,0.1)":"rgba(42,157,143,0.1)", borderRadius:12, padding:"12px 14px", borderLeft:"3px solid "+(i%2===0?"#457B9D":"#2A9D8F") }}>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:"0 0 4px", fontWeight:600 }}>{l.speaker}</p>
                    <p style={{ fontSize:16, margin:"0 0 4px", color:"#f0f0f0", lineHeight:1.6 }}>{l.text}</p>
                    <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:"0 0 2px" }}>{l.reading}</p>
                    <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", margin:0, fontStyle:"italic" }}>{l.translation}</p>
                  </div>
                ))}
              </div>
              {dlg.vocabulary && dlg.vocabulary.length > 0 && (
                <div style={{ marginTop:16 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.5)", margin:"0 0 8px" }}>📖 Vocabulário:</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {dlg.vocabulary.map((v, i) => <span key={i} style={{ fontSize:12, padding:"4px 10px", borderRadius:8, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)" }}><strong>{v.word}</strong> ({v.reading}) — {v.meaning}</span>)}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => { setDlgScr("exercises"); setDlgI(0); setDlgSel(null); setDlgExp(false); setDlgRes([]); }} style={ST.pri}>Responder perguntas →</button>
          </div>
        );
      }

      if (dlgScr === "exercises" && dlg && dlg.exercises[dlgI]) {
        const dex = dlg.exercises[dlgI];
        const dlgLastOk = dlgRes.length > 0 ? dlgRes[dlgRes.length-1] : null;
        return (
          <div style={ST.page}>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textAlign:"center", marginBottom:8 }}>Pergunta {dlgI+1}/{dlg.exercises.length}</p>
            <div style={ST.card}>
              <div style={ST.qbox}><p style={ST.qtxt}>{dex.question}</p></div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(dex.options||[]).map((o, i) => (
                  <OptionBtn key={i} text={o} idx={i} selected={dlgSel} correctIdx={dex.correct} onClick={() => {
                    if (dlgSel !== null) return;
                    setDlgSel(i);
                    const ok = i === dex.correct;
                    setDlgRes(p => [...p, ok]);
                    if (!ok) upW(w => recMistake(w, { category:"ESTRUTURA", level:dlg.level, topic:dex.topic||"diálogo", question:dex.question }));
                    setTimeout(() => setDlgExp(true), 300);
                  }} />
                ))}
              </div>
              {dlgExp && (
                <>
                  <div style={{ marginTop:16, padding:"14px 16px", background:"rgba(0,0,0,0.2)", borderRadius:10, borderLeft:"4px solid "+(dlgLastOk?"#2ecc71":"#e74c3c") }}>
                    <p style={{ fontSize:14, lineHeight:1.6, margin:0, color:"rgba(255,255,255,0.7)" }}>{dex.explanation}</p>
                  </div>
                  <button onClick={() => { if (dlgI < dlg.exercises.length-1) { setDlgI(i => i+1); setDlgSel(null); setDlgExp(false); } else { setDlgScr("done"); } }} style={ST.nxt}>{dlgI < dlg.exercises.length-1 ? "Próxima →" : "Concluir"}</button>
                </>
              )}
            </div>
          </div>
        );
      }

      if (dlgScr === "done" && dlg) {
        const dok = dlgRes.filter(Boolean).length;
        return (
          <div style={ST.page}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <span style={{ fontSize:48 }}>{dok === dlg.exercises.length ? "🎉" : "📚"}</span>
              <h3 style={{ fontSize:20, margin:"8px 0" }}>{dok}/{dlg.exercises.length} corretas</h3>
            </div>
            <button onClick={() => { setDlgScr("setup"); genDlg(); }} style={{ ...ST.pri, background:"linear-gradient(135deg,#2A9D8F,#1a8a7f)" }}>話 Novo Diálogo</button>
            <button onClick={() => setDlgScr("setup")} style={ST.ghost}>Voltar</button>
          </div>
        );
      }

      return (
        <div style={ST.page}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ ...ST.logo, background:"linear-gradient(135deg,#2A9D8F,#48dbfb)" }}><span style={{ fontSize:36, color:"#fff" }}>話</span></div>
            <h2 style={{ fontSize:24, fontWeight:800, margin:"16px 0 4px" }}>Mini-Diálogos</h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", margin:0 }}>Situações reais do dia a dia</p>
          </div>
          <div style={{ ...ST.card, marginBottom:16 }}><p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", margin:0, lineHeight:1.7 }}>Pratique japonês em contexto! Diálogos situacionais com vocabulário e perguntas.</p></div>
          <button onClick={genDlg} style={{ ...ST.pri, background:"linear-gradient(135deg,#2A9D8F,#1a8a7f)", boxShadow:"0 6px 24px rgba(42,157,143,0.35)" }}>話 Gerar Diálogo</button>
          {dlgErr && <p style={{ color:"#e74c3c", fontSize:12, textAlign:"center", marginTop:8 }}>{dlgErr}</p>}
        </div>
      );
    }

    /* ─── FLASHCARDS ─── */
    if (tab === "flashcards") {
      if (fcLoad) return <Loader label="Gerando flashcards..." onCancel={() => { setFcLoad(false); setFcErr("Cancelado pelo usuário"); }} />;

      if (fcScr === "studying" && fcs.length > 0 && fcs[fcI]) {
        const fc = fcs[fcI];
        const sl = ((app.srs || {}).nextReview || {})[fc._sid];
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
          <div style={{ ...ST.card, marginBottom:16 }}><p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", margin:0, lineHeight:1.7 }}>Errou → volta em 1 dia. Acertou → 1→3→7→14→30→60 dias.</p></div>
          <button onClick={genFc} style={{ ...ST.pri, background:"linear-gradient(135deg,#E9C46A,#d4a843)", color:"#1a1a2e", boxShadow:"0 6px 24px rgba(233,196,106,0.35)" }}>覚 Começar Sessão</button>
          {fcErr && <p style={{ color:"#e74c3c", fontSize:12, textAlign:"center", marginTop:8 }}>{fcErr}</p>}
        </div>
      );
    }

    /* ─── REVIEW ─── */
    if (tab === "review") {
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
              <button onClick={() => setApp(p => ({ ...p, reviewQueue: [] }))} style={{ ...ST.ghost, marginTop:16 }}>Limpar fila</button>
            </>
          )}
        </div>
      );
    }

    /* ─── REFERENCE ─── */
    if (tab === "reference") {
      return (
        <div style={ST.page}>
          <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 16px" }}>📖 Referência</h2>
          <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
            {[["verbs","動 Verbos"],["particles","助 Partículas"],["kanji","漢 Kanji"],["grammar","文 Gramática"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setRefSec(id)} style={{ ...ST.chip, background:refSec===id?"#457B9D":"rgba(255,255,255,0.08)", color:refSec===id?"#fff":"rgba(255,255,255,0.5)", borderColor:refSec===id?"#457B9D":"rgba(255,255,255,0.1)" }}>{lbl}</button>
            ))}
          </div>

          {refSec === "verbs" && VERBS.map((g, gi) => (
            <div key={gi} style={{ ...ST.card, marginBottom:12 }}>
              <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 4px", color:"#fff" }}>{g.title}</h3>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:"0 0 12px" }}>{g.desc}</p>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead><tr>{["辞書形","ます形","て形","ない形","た形","Sig."].map(h => <th key={h} style={{ padding:"6px 8px", borderBottom:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", fontWeight:600, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
                  <tbody>{g.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} style={{ padding:"6px 8px", borderBottom:"1px solid rgba(255,255,255,0.05)", color:ci===5?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.75)", whiteSpace:"nowrap" }}>{c}</td>)}</tr>)}</tbody>
                </table>
              </div>
            </div>
          ))}

          {refSec === "particles" && (
            <div style={ST.card}>
              {PARTICLES.map((p, i) => (
                <div key={i} style={{ padding:"10px 0", borderBottom:i<PARTICLES.length-1?"1px solid rgba(255,255,255,0.06)":"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <span style={{ fontSize:24, fontWeight:700, color:"#457B9D", width:36, textAlign:"center" }}>{p.p}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>{p.u}</span>
                  </div>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"0 0 0 46px" }}>{p.e}</p>
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:"2px 0 0 46px", fontStyle:"italic" }}>{p.t}</p>
                </div>
              ))}
            </div>
          )}

          {refSec === "kanji" && Object.entries(KANJI_LVL).map(([lvl, kanjis]) => (
            <div key={lvl} style={{ ...ST.card, marginBottom:12 }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:"0 0 10px", color:"rgba(255,255,255,0.7)" }}>{lvl}</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {kanjis.map(k => <span key={k} style={{ width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", fontSize:20, color:"rgba(255,255,255,0.8)" }}>{k}</span>)}
              </div>
            </div>
          ))}

          {refSec === "grammar" && GRAMMAR.map((g, i) => (
            <div key={i} style={{ ...ST.card, marginBottom:10 }}>
              <Badge bg="rgba(69,123,157,0.2)" color="#7fb8d8">{g.l}</Badge>
              <p style={{ fontSize:16, fontWeight:700, margin:"6px 0 4px", color:"#fff" }}>{g.p}</p>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"0 0 6px" }}>{g.d}</p>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", margin:0, background:"rgba(0,0,0,0.2)", padding:"6px 10px", borderRadius:8 }}>{g.e}</p>
            </div>
          ))}
        </div>
      );
    }

    /* ─── STATS ─── */
    if (tab === "stats") {
      const ch = stats.categoryHistory || {};
      const last7 = sessions.slice(-7);
      const avg = last7.length ? Math.round(last7.reduce((a, s) => a + (s.correct/s.total)*100, 0) / last7.length) : 0;

      return (
        <div style={ST.page}>
          <h2 style={{ fontSize:22, fontWeight:800, margin:"0 0 20px" }}>📊 Progresso</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            <div style={ST.stCard}><span style={{ fontSize:28, fontWeight:800 }}>{stats.dailyStreak || 0}</span><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>🔥 Dias seguidos</span></div>
            <div style={ST.stCard}><span style={{ fontSize:28, fontWeight:800 }}>{sessions.length}</span><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>📝 Sessões</span></div>
            <div style={ST.stCard}><span style={{ fontSize:28, fontWeight:800 }}>{stats.totalCorrect || 0}</span><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>✓ Acertos</span></div>
            <div style={ST.stCard}><span style={{ fontSize:28, fontWeight:800 }}>{avg}%</span><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>📈 Média 7 últ.</span></div>
          </div>

          {Object.keys(ch).length > 0 && (
            <div style={{ ...ST.card, marginBottom:16 }}>
              <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 12px", color:"rgba(255,255,255,0.7)" }}>Por categoria</h3>
              {Object.entries(ch).map(([cat, d]) => {
                const c = cs(cat);
                const pct = d.total ? Math.round((d.correct/d.total)*100) : 0;
                return (
                  <div key={cat} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>{c.icon} {c.label.split(" ")[1]}</span>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{pct}% ({d.correct}/{d.total})</span>
                    </div>
                    <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:pct+"%", background:c.color, borderRadius:3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {sessions.length > 0 && (
            <div style={{ ...ST.card, marginBottom:16 }}>
              <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 12px", color:"rgba(255,255,255,0.7)" }}>Últimas sessões</h3>
              <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:80 }}>
                {sessions.slice(-14).map((s, i) => {
                  const p = s.total ? (s.correct/s.total)*100 : 0;
                  return (
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                      <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{Math.round(p)}%</span>
                      <div style={{ width:"100%", height:Math.max(4, p*0.7)+"px", background:p>=80?"#2ecc71":p>=50?"#E9C46A":"#e74c3c", borderRadius:2 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <WeakPanel />
          <button onClick={() => { if (confirm("Resetar tudo?")) setApp(getDefaults()); }} style={{ ...ST.ghost, marginTop:8, fontSize:12, color:"rgba(255,255,255,0.25)" }}>Resetar tudo</button>
        </div>
      );
    }

    return null;
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

/* ══════════ STYLES ══════════ */
const ST = {
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
