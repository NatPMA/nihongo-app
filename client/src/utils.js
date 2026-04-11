import { CATS } from "./constants.js";

/* ══════════ ROMAJI→HIRAGANA ══════════ */
export const R2H={"a":"あ","i":"い","u":"う","e":"え","o":"お","ka":"か","ki":"き","ku":"く","ke":"け","ko":"こ","sa":"さ","shi":"し","si":"し","su":"す","se":"せ","so":"そ","ta":"た","chi":"ち","ti":"ち","tsu":"つ","tu":"つ","te":"て","to":"と","na":"な","ni":"に","nu":"ぬ","ne":"ね","no":"の","ha":"は","hi":"ひ","fu":"ふ","hu":"ふ","he":"へ","ho":"ほ","ma":"ま","mi":"み","mu":"む","me":"め","mo":"も","ya":"や","yu":"ゆ","yo":"よ","ra":"ら","ri":"り","ru":"る","re":"れ","ro":"ろ","wa":"わ","wo":"を","n":"ん","nn":"ん","ga":"が","gi":"ぎ","gu":"ぐ","ge":"げ","go":"ご","za":"ざ","ji":"じ","zi":"じ","zu":"ず","ze":"ぜ","zo":"ぞ","da":"だ","di":"ぢ","du":"づ","de":"で","do":"ど","ba":"ば","bi":"び","bu":"ぶ","be":"べ","bo":"ぼ","pa":"ぱ","pi":"ぴ","pu":"ぷ","pe":"ぺ","po":"ぽ","kya":"きゃ","kyu":"きゅ","kyo":"きょ","sha":"しゃ","shu":"しゅ","sho":"しょ","cha":"ちゃ","chu":"ちゅ","cho":"ちょ","nya":"にゃ","nyu":"にゅ","nyo":"にょ","hya":"ひゃ","hyu":"ひゅ","hyo":"ひょ","mya":"みゃ","myu":"みゅ","myo":"みょ","rya":"りゃ","ryu":"りゅ","ryo":"りょ","gya":"ぎゃ","gyu":"ぎゅ","gyo":"ぎょ","ja":"じゃ","ju":"じゅ","jo":"じょ","bya":"びゃ","byu":"びゅ","byo":"びょ","pya":"ぴゃ","pyu":"ぴゅ","pyo":"ぴょ"};

// Katakana → Hiragana (ア→あ etc.)
export function k2h(str) {
  return (str || "").replace(/[\u30A1-\u30F6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

// Normalize any Japanese input to hiragana for comparison
// handles: romaji, katakana, hiragana, kanji (kanji passes through unchanged)
export function normalizeAnswer(s) {
  return k2h(r2h((s || "").trim().toLowerCase()));
}

export function r2h(input) {
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

/* ══════════ STORAGE ══════════ */
export const SKEY = "nihongo-v3";

export function getDefaults() {
  return {
    weaknesses: { categories: {}, levels: {}, topics: {}, history: [] },
    srs: { nextReview: {} },
    stats: { sessions: [], dailyStreak: 0, lastSessionDate: null, totalCorrect: 0, totalAnswered: 0, categoryHistory: {} },
    reviewQueue: [],
    cardLibrary: [],
    myLevel: "B6", // ICBJ level id — change when you advance
  };
}

/* Returns a new stats object with dailyStreak set to 0 if the last session
   was more than one day ago (i.e. the user missed at least one day). */
export function resetStreakIfStale(stats) {
  if (!stats.lastSessionDate || !stats.dailyStreak) return stats;
  const today = new Date().toISOString().split("T")[0];
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  const yesterday = yd.toISOString().split("T")[0];
  if (stats.lastSessionDate !== today && stats.lastSessionDate !== yesterday) {
    return { ...stats, dailyStreak: 0 };
  }
  return stats;
}

export function loadData() {
  try {
    const raw = localStorage.getItem(SKEY);
    if (raw) {
      const d = JSON.parse(raw);
      const def = getDefaults();
      const data = {
        weaknesses: Object.assign({}, def.weaknesses, d.weaknesses || {}),
        srs: Object.assign({ nextReview: {} }, d.srs || {}),
        stats: Object.assign({}, def.stats, d.stats || {}),
        reviewQueue: Array.isArray(d.reviewQueue) ? d.reviewQueue : [],
        cardLibrary: Array.isArray(d.cardLibrary) ? d.cardLibrary : [],
        myLevel: d.myLevel || "B6",
      };
      // Reset streak if the user missed more than one day
      data.stats = resetStreakIfStale(data.stats);
      return data;
    }
  } catch (e) { /* ignore */ }
  return getDefaults();
}

export function saveData(d) {
  try { localStorage.setItem(SKEY, JSON.stringify(d)); } catch (e) { /* ignore */ }
}

/* ══════════ API — chama o backend local ══════════ */
export async function callAPI(system, userMsg) {
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

/* ══════════ RETRY WRAPPER ══════════ */
export async function withRetry(fn, maxAttempts = 2) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const msg = err.message || "";
      // Never retry on user cancellation or timeout — those are intentional
      if (msg.includes("Tempo esgotado") || msg.includes("Cancelado")) throw err;
      if (attempt < maxAttempts) await new Promise(r => setTimeout(r, 1500));
    }
  }
  throw lastErr;
}

/* ══════════ SANITIZERS ══════════ */
export function sanitizeEx(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(e => e && e.question).map((e, i) => {
    const rawOpts = Array.isArray(e.options) ? e.options.map(o => String(o != null ? o : "")).filter(Boolean) : [];
    // Detect placeholder single-letter options like ["A","B","C","D"] — treat as empty
    const isPlaceholder = rawOpts.length > 0 && rawOpts.every(o => /^[A-Da-d]$/.test(o.trim()));
    const opts = (!isPlaceholder && rawOpts.length >= 2) ? rawOpts : [];
    // If no valid options, demote to typing so the student gets an input box
    const type = opts.length >= 2 ? (e.type || "multiple_choice") : "typing";
    const cor = (typeof e.correct === "number" && e.correct >= 0 && opts.length && e.correct < opts.length) ? e.correct : 0;
    return {
      id: e.id || i+1, category: e.category || "VOCABULÁRIO", level: e.level || "Básico 1",
      topic: e.topic || "", type, question: e.question,
      options: opts, correct: cor, explanation: e.explanation || "",
      accepted_answers: Array.isArray(e.accepted_answers) ? e.accepted_answers : [],
    };
  });
}

export function sanitizeDlg(d) {
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

export function sanitizeFc(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(c => c && c.front).map((c, i) => ({
    id: c.id || i+1, category: c.category || "VOCABULÁRIO", level: c.level || "Básico 1",
    front: c.front, back: c.back || "?", reading: c.reading || "",
    topic: c.topic || "", hint: c.hint || "",
  }));
}

/* ══════════ WEAKNESS HELPERS ══════════ */
export function recMistake(w, ex) {
  const o = JSON.parse(JSON.stringify(w));
  const cat = ex.category || "OUTRO", lvl = ex.level || "?", t = ex.topic || "";
  o.categories[cat] = (o.categories[cat] || 0) + 1;
  o.levels[lvl] = (o.levels[lvl] || 0) + 1;
  if (t) o.topics[t] = (o.topics[t] || 0) + 1;
  o.history.push({ category: cat, level: lvl, topic: t, question: ex.question, date: new Date().toISOString() });
  if (o.history.length > 100) o.history = o.history.slice(-100);
  return o;
}

export function recCorrect(w, ex) {
  const o = JSON.parse(JSON.stringify(w));
  const t = ex.topic || "";
  if (t && o.topics[t] > 0) { o.topics[t] = Math.max(0, o.topics[t] - 0.5); if (!o.topics[t]) delete o.topics[t]; }
  const c = ex.category || "";
  if (c && o.categories[c] > 0) { o.categories[c] = Math.max(0, o.categories[c] - 0.3); if (o.categories[c] <= 0) delete o.categories[c]; }
  const l = ex.level || "";
  if (l && o.levels[l] > 0) { o.levels[l] = Math.max(0, o.levels[l] - 0.3); if (o.levels[l] <= 0) delete o.levels[l]; }
  return o;
}

export function weakPrompt(w) {
  const tt = Object.entries(w.topics || {}).filter(x => x[1] >= 1).sort((a,b) => b[1]-a[1]).slice(0, 6);
  if (!tt.length) return "";
  return "\n\nPONTOS FRACOS (4-5 dos 10 devem focar neles):\n" + tt.map(x => `- "${x[0]}" (${Math.round(x[1])}x)`).join("\n");
}

export function topWeak(w, n) {
  return Object.entries(w.topics || {}).filter(x => x[1] >= 1).sort((a,b) => b[1]-a[1]).slice(0, n || 6);
}

export function cs(c) { return CATS[c] || { label: c, color: "#888", icon: "?" }; }
