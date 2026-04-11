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

// Base system prompt — curriculum-specific content is injected dynamically in App.jsx
export const EX_SYS_BASE = `Você é professor de japonês do ICBJ (Instituto Cultural Brasil-Japão).
Gere exatamente 10 exercícios de japonês em JSON para uma aluna que está no nível indicado.

REGRAS OBRIGATÓRIAS — LEIA COM ATENÇÃO:
1. IDIOMA: Todo texto em japonês (frases, opções) deve usar escrita japonesa REAL: kanji + hiragana + katakana. NUNCA use romaji. Nunca.
2. INSTRUÇÃO OBRIGATÓRIA: O campo "question" deve SEMPRE começar com uma instrução clara em português dizendo o que a aluna deve fazer, seguida da frase/conteúdo em japonês. Exemplos:
   - "O que significa a frase: 先生は学生に文章を書かせます。？"
   - "Complete com a forma passiva de ほめる: 田中さんは部長に＿＿＿。"
   - "Complete com a forma causativa de 食べる: 母は子供に野菜を＿＿＿。"
   - "Traduza para o japonês: Eu fui mandado fazer o dever de casa pelo professor."
   - "Escolha a opção que expressa uma ação passiva: ___"
3. FILL_BLANK / TYPING — REGRA EXTRA: Para exercícios de completar/digitar que envolvem conjugação, a question DEVE mencionar o verbo no dicionário (ex: "forma passiva de 食べる", "forma causativa de する"). Nunca deixe a aluna adivinhar qual verbo usar.
4. Kanji: SEMPRE em palavras ou frases com contexto — nunca pergunte leitura isolada. Pergunte o SIGNIFICADO em uso.
5. Tipos de exercício e suas regras:
   - "multiple_choice": OBRIGATÓRIO ter 4 opções reais em japonês no campo "options". NUNCA use ["A","B","C","D"].
   - "fill_blank": deixe "options" como [] vazio — a aluna digita a resposta. Coloque as respostas corretas em "accepted_answers".
   - "typing": deixe "options" como [] vazio — a aluna digita. Coloque as respostas corretas em "accepted_answers".
   - "translate": deixe "options" como [] vazio. Coloque a resposta em "accepted_answers".
   - "conjugation": pode ser multiple_choice (com 4 opções em japonês) ou typing (sem opções).
6. Explicações SEMPRE em português, claras e didáticas
7. Use APENAS gramática e kanji do currículo fornecido
8. NÃO invente gramática fora do currículo
9. accepted_answers para fill_blank/typing DEVE incluir a resposta correta em japonês/hiragana para que o app possa verificar
10. KANJI RESTRITO: use APENAS os kanji da lista fornecida abaixo. NÃO use nenhum kanji que não esteja nessa lista. Se precisar de uma palavra com kanji desconhecido, escreva em hiragana.

DISTRIBUIÇÃO DOS 10 EXERCÍCIOS:
- 7 exercícios: nível atual + nível anterior (foco principal)
- 3 exercícios: revisão dos níveis mais antigos

FORMATO JSON OBRIGATÓRIO — exemplo real (substitua pelo conteúdo correto):
[{
  "id": 1,
  "category": "GRAMÁTICA",
  "level": "Básico 6",
  "topic": "passiva",
  "type": "multiple_choice",
  "question": "Complete com a forma passiva correta: 田中さんは部長に______。",
  "options": ["ほめられました","ほめさせました","ほめてもらいました","ほめてあげました"],
  "correct": 0,
  "explanation": "A voz passiva ～られる indica que Tanaka-san recebeu o elogio do chefe.",
  "accepted_answers": []
}]
APENAS o array JSON, sem texto extra, sem blocos de código.`;

export const DLG_SYS = `Você é professor de japonês do ICBJ. Gere 1 diálogo curto (3-4 falas) situacional com 2 perguntas de compreensão.
Use APENAS gramática e vocabulário do currículo fornecido na mensagem do usuário.
IMPORTANTE: Todo texto em japonês (falas, perguntas, opções) deve usar escrita japonesa real (kanji/hiragana/katakana). NUNCA use romaji.
As opções das perguntas de compreensão devem ser frases em japonês, não letras soltas.
JSON: {"situation":"nome pt","situation_jp":"nome em japonês","level":"Básico X","dialogue":[{"speaker":"A","text":"texto em japonês","reading":"leitura em hiragana","translation":"tradução pt"}],"exercises":[{"id":1,"question":"pergunta em japonês ou português","options":["opção em japonês","opção em japonês","opção em japonês","opção em japonês"],"correct":0,"explanation":"explicação em português"}],"vocabulary":[{"word":"palavra em japonês","reading":"leitura","meaning":"significado pt"}]}
Diálogo CURTO e natural. APENAS JSON, sem texto extra.`;

export const FC_SYS = `Você é professor de japonês do ICBJ. Gere flashcards do vocabulário e gramática do currículo fornecido.
Para kanji: frente = kanji em uma PALAVRA (não isolado), verso = significado em português.
JSON: [{"id":1,"category":"KANJI|VOCABULÁRIO|GRAMÁTICA","level":"Básico X","front":"jp","back":"pt","reading":"hira","topic":"tópico","hint":"dica opcional"}]
APENAS JSON.`;

export const KANJI_EX_SYS = `Você é professor de japonês. Dado um kanji e o nível da aluna, gere 1 frase de exemplo curta e natural que usa esse kanji numa palavra real.
Responda APENAS em JSON (sem texto extra): {"sentence":"frase em japonês","reading":"leitura completa em hiragana","translation":"tradução em português"}`;

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

export const GRAMMAR = [
  // B1
  {l:"B1",p:"～は～です / ではありません",d:"Identidade e negação",e:"私は学生です。"},
  {l:"B1",p:"これ・それ・あれ",d:"Demonstrativos",e:"これは何ですか？"},
  {l:"B1",p:"～ます / ～ません",d:"Forma polida presente",e:"食べます / 食べません"},
  {l:"B1",p:"Partículas は・が・を・に・で・へ・と・も・の",d:"Partículas básicas",e:"私は学校に行きます。"},
  // B2
  {l:"B2",p:"います・あります",d:"Existência (animado/inanimado)",e:"猫がいます。本があります。"},
  {l:"B2",p:"い-adjetivos / な-adjetivos",d:"Adjetivos e conjugações",e:"おいしい / 静かな"},
  {l:"B2",p:"Contadores ～つ・～本・～枚・～冊・～匹",d:"Contagem de objetos",e:"りんごを三つ買いました。"},
  // B3
  {l:"B3",p:"て-forma",d:"Conectar ações / pedidos",e:"食べて、飲んでください。"},
  {l:"B3",p:"～ています",d:"Ação em progresso / estado",e:"今、勉強しています。"},
  {l:"B3",p:"～てもいいですか",d:"Pedir permissão",e:"写真を撮ってもいいですか？"},
  {l:"B3",p:"～てはいけません",d:"Proibição",e:"ここで食べてはいけません。"},
  {l:"B3",p:"あげる・もらう・くれる",d:"Dar e receber (objetos e ações)",e:"友達にプレゼントをあげました。"},
  // B4
  {l:"B4",p:"～たことがある / ない",d:"Experiência passada",e:"日本に行ったことがあります。"},
  {l:"B4",p:"～（ら）れる (potencial)",d:"Conseguir fazer X",e:"日本語が話せます。"},
  {l:"B4",p:"～たい / ～たくない",d:"Querer / não querer fazer",e:"日本に行きたいです。"},
  {l:"B4",p:"～ほうがいい",d:"Conselho: é melhor fazer X",e:"早く寝たほうがいいですよ。"},
  {l:"B4",p:"Oração relativa [V]＋N",d:"Modificação nominal com verbo",e:"昨日買った本はおもしろいです。"},
  {l:"B4",p:"～と思います",d:"Opinião / reported speech",e:"明日は雨だと思います。"},
  // B5
  {l:"B5",p:"～なければなりません",d:"Obrigação: tem que fazer X",e:"薬を飲まなければなりません。"},
  {l:"B5",p:"～てしまいました",d:"Completude / lamento",e:"財布を忘れてしまいました。"},
  {l:"B5",p:"～ておきます",d:"Fazer com antecedência",e:"パーティーの前に料理を作っておきます。"},
  {l:"B5",p:"～てみます",d:"Tentar fazer (experiência)",e:"この料理を食べてみてください。"},
  {l:"B5",p:"～ようになります",d:"Passar a fazer X (mudança)",e:"日本語が話せるようになりました。"},
  {l:"B5",p:"Keigo básico (お～します / いらっしゃいます)",d:"Linguagem honorífica",e:"少々お待ちください。"},
  // B6
  {l:"B6",p:"形causativa: ～させる / ～させます",d:"Fazer alguém fazer X",e:"先生は学生に漢字を書かせました。"},
  {l:"B6",p:"～させてください",d:"Pedir licença (humilde)",e:"私にやらせてください。"},
  {l:"B6",p:"形passiva: ～られる / ～される",d:"Sofrer uma ação",e:"田中さんに財布を盗まれました。"},
  {l:"B6",p:"Passiva de inconveniência",d:"Sofrer algo indesejado",e:"雨に降られて、びしょぬれになりました。"},
  {l:"B6",p:"～たら",d:"Condicional: quando/se X acontecer",e:"駅に着いたら、電話してください。"},
  {l:"B6",p:"～ば",d:"Condicional hipotético formal",e:"お金があれば、旅行します。"},
  {l:"B6",p:"～と",d:"Condicional natural/automático",e:"春になると、桜が咲きます。"},
  {l:"B6",p:"～なら",d:"Condicional contextual",e:"日本に行くなら、京都がいいですよ。"},
];
