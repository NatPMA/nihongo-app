/* ══════════ CONSTANTS ══════════ */
export const CATS = {
  KANJI: { label: "漢字 Kanji", color: "#E63946", icon: "字" },
  GRAMÁTICA: { label: "文法 Gramática", color: "#457B9D", icon: "文" },
  ESTRUTURA: { label: "構造 Estrutura", color: "#2A9D8F", icon: "構" },
  VOCABULÁRIO: { label: "語彙 Vocabulário", color: "#E9C46A", icon: "語" },
};

export const LCOL = { "Básico 1":"#ff6b6b","Básico 2":"#ff9f43","Básico 3":"#feca57","Básico 4":"#48dbfb","Básico 5":"#0abde3","Básico 6":"#5f27cd" };

export const TABS = [
  { id:"home", icon:"家", label:"Treino" },
  { id:"dialogues", icon:"話", label:"Diálogos" },
  { id:"flashcards", icon:"覚", label:"Flashcards" },
  { id:"review", icon:"復", label:"Revisão" },
  { id:"reference", icon:"辞", label:"Referência" },
  { id:"stats", icon:"績", label:"Progresso" },
];

/* ══════════ PROMPTS ══════════ */
export const EX_SYS = `Professor de japonês do ICBJ (Básico 1-6). Gere exercícios em JSON. Sem hiragana/katakana puros.
Cada exercício: id, category (KANJI|GRAMÁTICA|ESTRUTURA|VOCABULÁRIO), level (Básico 1-6), topic (tópico curto), type (multiple_choice|fill_blank|translate|reading|conjugation|typing), question, options (4), correct (0-3), explanation, accepted_answers (array, só typing).
B1-2: partículas は/が/を/に/で, ます形, kanji básico. B3-4: て/た/ない形, ている, たことがある, より. B5-6: potencial, passiva, causativa, たら/ば/なら, keigo.
APENAS array JSON.`;

export const DLG_SYS = `Professor de japonês do ICBJ. Gere 1 diálogo curto (3-4 falas) com 2 perguntas.
JSON: {"situation":"nome pt","situation_jp":"jp","level":"Básico 1-6","dialogue":[{"speaker":"A","text":"jp","reading":"hira","translation":"pt"}],"exercises":[{"id":1,"question":"..","options":["A","B","C","D"],"correct":0,"explanation":".."}],"vocabulary":[{"word":"..","reading":"..","meaning":".."}]}
Diálogo CURTO. APENAS JSON, sem texto extra.`;

export const FC_SYS = `Professor de japonês do ICBJ. Gere flashcards.
JSON: [{"id":1,"category":"KANJI|VOCABULÁRIO|GRAMÁTICA","level":"Básico X","front":"jp","back":"pt","reading":"hira","topic":"tópico","hint":"dica"}]
APENAS JSON.`;

/* ══════════ REFERENCE DATA ══════════ */
export const VERBS = [
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

export const PARTICLES = [
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

export const KANJI_LVL = {
  "Básico 1-2":"一二三四五六七八九十日月年人大小中上下山川田本木水火金土生学校先名何白百千万".split(""),
  "Básico 3-4":"食飲見聞読書話買行来出入立休言思知持住使作走歩開閉教習会待始終送".split(""),
  "Básico 5-6":"動働転運強弱早遅長短高安新古多少広近遠重軽明暗".split(""),
};

export const GRAMMAR = [
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
