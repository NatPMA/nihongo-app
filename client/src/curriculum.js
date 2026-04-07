/* ══════════════════════════════════════════════════════════════════
   ICBJ CURRICULUM — Instituto Cultural Brasil-Japão
   Básico 1–6 (extensible to B7+)

   Kanji lists extracted directly from the ICBJ apostila.
   Grammar points from official ICBJ course descriptions + apostila photos.
   Each level can be added as a new object in the LEVELS array.
   ══════════════════════════════════════════════════════════════════ */

export const LEVELS = [
  /* ─────────────── BÁSICO 1 ─────────────── */
  {
    id: "B1",
    label: "Básico 1",
    writing: "Hiragana",
    grammar: [
      "～は～です / ～は～ではありません (identidade e negação)",
      "これ・それ・あれ・どれ (demonstrativos de objetos)",
      "ここ・そこ・あそこ・どこ (demonstrativos de lugar)",
      "Partícula は (tópico), が (sujeito), を (objeto direto)",
      "Partícula に (direção, tempo), で (local de ação, meio)",
      "Partícula へ (direção), と (e, com), も (também)",
      "Partícula の (posse, modificação nominal)",
      "Partícula から (de, desde), まで (até)",
      "～ます / ～ません / ～ましたか (forma polida presente/passado)",
      "Números 1–10.000, horas, dias da semana, meses",
      "Adjetivos い e な na forma básica (positivo/negativo)",
      "Pronomes pessoais: 私・あなた・彼・彼女",
      "Perguntas com か: ～ですか、～ますか",
      "Expressões de cortesia: すみません、ありがとう、よろしく",
    ],
    vocabThemes: [
      "Saudações e apresentações",
      "Profissões e nacionalidades",
      "Família básica",
      "Números e dinheiro",
      "Horas e agenda",
      "Locais (escola, estação, hospital, banco)",
      "Comidas e bebidas básicas",
      "Cores básicas",
    ],
    kanji: [], // B1 = apenas hiragana
    kanjiWithMeaning: [],
  },

  /* ─────────────── BÁSICO 2 ─────────────── */
  {
    id: "B2",
    label: "Básico 2",
    writing: "Katakana",
    grammar: [
      "います・あります (existência de seres animados e inanimados)",
      "～に います/あります (localização: Xはどこにありますか)",
      "Adjetivos い: conjugação positivo/negativo/passado",
      "Adjetivos な: conjugação positivo/negativo/passado",
      "Contadores: 〜つ, 〜個, 〜枚, 〜本, 〜冊, 〜台, 〜匹, 〜人, 〜杯",
      "Verbos de grupo 1 (五段) e grupo 2 (一段) — forma ます",
      "Verbos irregulares: する・来る",
      "Rotina diária com advérbios de frequência (いつも、よく、たまに)",
      "Perguntas com interrogativos: 何・誰・どこ・いつ・どう・どんな",
      "～から～まで (de X até Y)",
      "Expressão de quantidade com numeral + counter",
    ],
    vocabThemes: [
      "Katakana — empréstimos e estrangeirismos",
      "Animais",
      "Objetos do cotidiano",
      "Transporte (電車・バス・車・自転車)",
      "Verbos de ação básicos",
      "Rotina diária",
      "Loja e compras básicas",
      "Partes do corpo básicas",
    ],
    kanji: [], // B2 = apenas katakana
    kanjiWithMeaning: [],
  },

  /* ─────────────── BÁSICO 3 ─────────────── */
  {
    id: "B3",
    label: "Básico 3",
    writing: "Kanji introduzido (#1–55)",
    grammar: [
      "て-forma (te-form): formação para grupos 1, 2 e irregulares",
      "〜ています (ação em progresso / estado resultante)",
      "〜てください (pedido educado)",
      "〜てもいいですか (pedir permissão)",
      "〜てはいけません (proibição)",
      "〜てから (depois de fazer X, faz Y)",
      "〜ないでください (pedido negativo: por favor não faça)",
      "Forma て para conectar frases sequenciais",
      "あげる・もらう・くれる (dar e receber — objetos)",
      "〜てあげる・〜てもらう・〜てくれる (dar e receber — ações/favores)",
      "Adjetivos い e な modificando substantivos",
      "〜が好きです・〜が嫌いです・〜が上手です・〜が下手です",
    ],
    vocabThemes: [
      "Atividades de lazer e hobbies",
      "Regras e permissões",
      "Favores entre pessoas",
      "Dias e calendário (#kanji 日月火水木金土)",
      "Natureza básica (山・川・田・森・林)",
      "Escola e aprendizado",
      "Números em kanji",
    ],
    kanji: ["日","月","木","山","川","田","人","口","車","門","火","水","金","土","子","女","学","生","先","私","一","二","三","四","五","六","七","八","九","十","百","千","万","円","年","上","下","中","大","小","本","半","分","力","何","明","休","体","好","男","林","森","間","畑","岩"],
    kanjiWithMeaning: [
      {k:"日",m:"dia / sol"},{k:"月",m:"mês / lua"},{k:"木",m:"árvore"},{k:"山",m:"montanha"},{k:"川",m:"rio"},{k:"田",m:"arrozal"},{k:"人",m:"pessoa"},{k:"口",m:"boca"},{k:"車",m:"carro"},{k:"門",m:"portão"},{k:"火",m:"fogo"},{k:"水",m:"água"},{k:"金",m:"ouro / dinheiro"},{k:"土",m:"terra"},{k:"子",m:"criança"},{k:"女",m:"mulher"},{k:"学",m:"estudar"},{k:"生",m:"vida / nascer"},{k:"先",m:"antes / frente"},{k:"私",m:"eu"},{k:"一",m:"um"},{k:"二",m:"dois"},{k:"三",m:"três"},{k:"四",m:"quatro"},{k:"五",m:"cinco"},{k:"六",m:"seis"},{k:"七",m:"sete"},{k:"八",m:"oito"},{k:"九",m:"nove"},{k:"十",m:"dez"},{k:"百",m:"cem"},{k:"千",m:"mil"},{k:"万",m:"dez mil"},{k:"円",m:"iene / círculo"},{k:"年",m:"ano"},{k:"上",m:"em cima"},{k:"下",m:"embaixo"},{k:"中",m:"dentro / meio"},{k:"大",m:"grande"},{k:"小",m:"pequeno"},{k:"本",m:"livro / origem"},{k:"半",m:"metade"},{k:"分",m:"minuto / dividir"},{k:"力",m:"força"},{k:"何",m:"o quê"},{k:"明",m:"claro / amanhã"},{k:"休",m:"descanso"},{k:"体",m:"corpo"},{k:"好",m:"gostar"},{k:"男",m:"homem"},{k:"林",m:"bosque"},{k:"森",m:"floresta"},{k:"間",m:"intervalo / entre"},{k:"畑",m:"campo cultivado"},{k:"岩",m:"rocha"},
    ],
  },

  /* ─────────────── BÁSICO 4 ─────────────── */
  {
    id: "B4",
    label: "Básico 4",
    writing: "Kanji (#56–123)",
    grammar: [
      "〜たことがある (experiência passada: já fiz X alguma vez)",
      "〜たことがない (nunca fiz X)",
      "Forma potencial: 〜られる (gr.2) / 〜える (gr.1) — conseguir fazer X",
      "〜たい・〜たくない (querer / não querer fazer X)",
      "〜ほうがいい (é melhor fazer X — conselho)",
      "〜なくてもいいです (não precisa fazer X)",
      "Orações relativas: [oração] + substantivo (modificação nominal com verbo)",
      "〜と思います (acho que / penso que — opinião / reported speech)",
      "〜と言っていました (disse que — reported speech)",
      "Comparações: AはBより〜 / AとBとどちらが〜",
      "〜ので (porque — razão/causa formal)",
      "〜し、〜し (além disso / vários motivos)",
      "〜でしょう (probabilidade / suposição educada)",
    ],
    vocabThemes: [
      "Experiências de vida e viagens",
      "Desejos e planos futuros",
      "Comparações de objetos e lugares",
      "Partes do corpo (#kanji 目耳手足)",
      "Animais (#kanji 牛馬鳥魚)",
      "Alimentos e refeições (#kanji 肉食飲)",
      "Família completa (#kanji 父母兄姉弟妹夫妻彼)",
      "Tempo cronológico (#kanji 朝昼夜晩今週曜)",
    ],
    kanji: ["目","耳","手","足","雨","竹","米","貝","石","糸","花","茶","肉","文","字","物","牛","馬","鳥","魚","新","古","長","短","高","安","低","暗","多","少","行","来","帰","食","飲","読","書","話","見","聞","買","売","教","会","思","朝","昼","夜","晩","午","前","後","毎","週","曜","今","夕","時","友","父","母","兄","姉","弟","妹","夫","妻","彼"],
    kanjiWithMeaning: [
      {k:"目",m:"olho"},{k:"耳",m:"orelha"},{k:"手",m:"mão"},{k:"足",m:"pé / perna"},{k:"雨",m:"chuva"},{k:"竹",m:"bambu"},{k:"米",m:"arroz (grão)"},{k:"貝",m:"concha"},{k:"石",m:"pedra"},{k:"糸",m:"fio"},{k:"花",m:"flor"},{k:"茶",m:"chá"},{k:"肉",m:"carne"},{k:"文",m:"texto / escrita"},{k:"字",m:"caractere / letra"},{k:"物",m:"coisa / objeto"},{k:"牛",m:"vaca / boi"},{k:"馬",m:"cavalo"},{k:"鳥",m:"pássaro"},{k:"魚",m:"peixe"},{k:"新",m:"novo"},{k:"古",m:"antigo / velho"},{k:"長",m:"longo / chefe"},{k:"短",m:"curto"},{k:"高",m:"alto / caro"},{k:"安",m:"barato / seguro"},{k:"低",m:"baixo"},{k:"暗",m:"escuro"},{k:"多",m:"muito / muitos"},{k:"少",m:"pouco / poucos"},{k:"行",m:"ir"},{k:"来",m:"vir"},{k:"帰",m:"voltar (para casa)"},{k:"食",m:"comer / comida"},{k:"飲",m:"beber"},{k:"読",m:"ler"},{k:"書",m:"escrever"},{k:"話",m:"falar / história"},{k:"見",m:"ver / olhar"},{k:"聞",m:"ouvir / perguntar"},{k:"買",m:"comprar"},{k:"売",m:"vender"},{k:"教",m:"ensinar"},{k:"会",m:"encontrar / reunião"},{k:"思",m:"pensar"},{k:"朝",m:"manhã"},{k:"昼",m:"meio-dia / tarde"},{k:"夜",m:"noite"},{k:"晩",m:"noite (tarde)"},{k:"午",m:"meio-dia"},{k:"前",m:"antes / frente"},{k:"後",m:"depois / atrás"},{k:"毎",m:"cada / todo"},{k:"週",m:"semana"},{k:"曜",m:"dia da semana"},{k:"今",m:"agora / este"},{k:"夕",m:"tarde / entardecer"},{k:"時",m:"hora / tempo"},{k:"友",m:"amigo"},{k:"父",m:"pai"},{k:"母",m:"mãe"},{k:"兄",m:"irmão mais velho"},{k:"姉",m:"irmã mais velha"},{k:"弟",m:"irmão mais novo"},{k:"妹",m:"irmã mais nova"},{k:"夫",m:"marido"},{k:"妻",m:"esposa"},{k:"彼",m:"ele / namorado"},
    ],
  },

  /* ─────────────── BÁSICO 5 ─────────────── */
  {
    id: "B5",
    label: "Básico 5",
    writing: "Kanji (#124–216)",
    grammar: [
      "〜なければなりません / 〜なければならない (obrigação: tem que fazer X)",
      "〜なくてもいいです (não é obrigação: não precisa fazer X)",
      "〜てしまいました (acabou fazendo X — lamento / completude)",
      "〜ておきます (fazer X com antecedência / preparação)",
      "〜てみます (tentar fazer X — experiência)",
      "〜ていきます・〜てきます (ir fazendo / vir fazendo — mudança progressiva)",
      "〜ようにします (fazer esforço para / procurar fazer X)",
      "〜ようになります (passar a fazer X — mudança de estado)",
      "Keigo — linguagem honorífica básica:",
      "  ます形 → お〜します / いたします (humilde)",
      "  ます形 → お〜になります / いらっしゃいます (respeitosa)",
      "〜そうです (parece que — aparência visual)",
      "〜らしいです (parece que — baseado em informação/rumor)",
      "〜はずです (deveria ser / é esperado que)",
      "Forma た + り、〜たり します (fazer X e Y entre outras coisas)",
    ],
    vocabThemes: [
      "Direções e pontos cardeais (#kanji 東西南北)",
      "Natureza e geografia (#kanji 海空島谷)",
      "Estações do ano (#kanji 春夏秋冬)",
      "Cores (#kanji 赤青白黒黄)",
      "Verbos de deslocamento e mudança",
      "Trabalho e empresa (#kanji 社員客)",
      "Escola e estudo (#kanji 校料理塩)",
      "Expressões de polidez formal",
    ],
    kanji: ["主","奥","家","国","町","村","元","気","天","語","右","左","東","西","北","南","外","内","方","社","春","夏","秋","冬","海","赤","青","白","空","英","才","予","写","衣","色","形","店","祝","約","借","酒","真","絵","番","楽","親","犬","号","束","黒","黄","客","返","送","貸","太","自","近","作","事","油","味","活","校","料","理","塩","遠","飯","昭","和","京","終","動","園","死","鼻","頭","考","所","遊","羽","草","待","次","数","光","度","野","声","急","正"],
    kanjiWithMeaning: [
      {k:"主",m:"dono / principal"},{k:"奥",m:"fundo / interior"},{k:"家",m:"casa / família"},{k:"国",m:"país"},{k:"町",m:"cidade / bairro"},{k:"村",m:"vila / aldeia"},{k:"元",m:"origem / saúde"},{k:"気",m:"energia / espírito"},{k:"天",m:"céu"},{k:"語",m:"língua / palavra"},{k:"右",m:"direita"},{k:"左",m:"esquerda"},{k:"東",m:"leste"},{k:"西",m:"oeste"},{k:"北",m:"norte"},{k:"南",m:"sul"},{k:"外",m:"fora"},{k:"内",m:"dentro"},{k:"方",m:"direção / pessoa (formal)"},{k:"社",m:"empresa / santuário"},{k:"春",m:"primavera"},{k:"夏",m:"verão"},{k:"秋",m:"outono"},{k:"冬",m:"inverno"},{k:"海",m:"mar"},{k:"赤",m:"vermelho"},{k:"青",m:"azul / verde"},{k:"白",m:"branco"},{k:"空",m:"céu / vazio"},{k:"英",m:"inglês / herói"},{k:"才",m:"talento / anos de idade"},{k:"予",m:"antecipação"},{k:"写",m:"copiar / fotografar"},{k:"衣",m:"roupa"},{k:"色",m:"cor"},{k:"形",m:"forma"},{k:"店",m:"loja"},{k:"祝",m:"celebrar / felicitação"},{k:"約",m:"aproximadamente / promessa"},{k:"借",m:"pedir emprestado"},{k:"酒",m:"álcool / saquê"},{k:"真",m:"verdadeiro / puro"},{k:"絵",m:"pintura / desenho"},{k:"番",m:"número / vez"},{k:"楽",m:"prazer / fácil"},{k:"親",m:"pai/mãe / íntimo"},{k:"犬",m:"cachorro"},{k:"号",m:"número / sinal"},{k:"束",m:"feixe / amarrar"},{k:"黒",m:"preto"},{k:"黄",m:"amarelo"},{k:"客",m:"cliente / hóspede"},{k:"返",m:"devolver / responder"},{k:"送",m:"enviar"},{k:"貸",m:"emprestar"},{k:"太",m:"gordo / grosso"},{k:"自",m:"próprio / si mesmo"},{k:"近",m:"perto"},{k:"作",m:"fazer / criar"},{k:"事",m:"coisa / assunto"},{k:"油",m:"óleo"},{k:"味",m:"sabor"},{k:"活",m:"ativo / viver"},{k:"校",m:"escola"},{k:"料",m:"taxa / material"},{k:"理",m:"razão / lógica"},{k:"塩",m:"sal"},{k:"遠",m:"longe"},{k:"飯",m:"arroz cozido / refeição"},{k:"昭",m:"brilhante (era Showa)"},{k:"和",m:"harmonia / Japão"},{k:"京",m:"capital"},{k:"終",m:"terminar / fim"},{k:"動",m:"mover"},{k:"園",m:"jardim / parque"},{k:"死",m:"morte / morrer"},{k:"鼻",m:"nariz"},{k:"頭",m:"cabeça"},{k:"考",m:"pensar / considerar"},{k:"所",m:"lugar"},{k:"遊",m:"brincar / passear"},{k:"羽",m:"asa / pena"},{k:"草",m:"grama / erva"},{k:"待",m:"esperar"},{k:"次",m:"próximo / seguinte"},{k:"数",m:"número / contar"},{k:"光",m:"luz"},{k:"度",m:"grau / vez"},{k:"野",m:"campo / selvagem"},{k:"声",m:"voz"},{k:"急",m:"urgente / rápido"},{k:"正",m:"correto / justo"},
    ],
  },

  /* ─────────────── BÁSICO 6 ─────────────── */
  {
    id: "B6",
    label: "Básico 6",
    writing: "Kanji (#217–293)",
    grammar: [
      // CAUSATIVA (させる) — from apostila pages 4–11
      "Forma causativa: verbo gr.1 → 〜わせる/〜かせる etc., gr.2 → 〜させる, する→させる, くる→こさせる",
      "〜させます (fazer alguém fazer X — autoridade/hierarquia)",
      "〜させてください (pedir licença para fazer X — humilde)",
      "〜させてもらえませんか (pedir permissão mais educadamente)",
      "Causativa de ação obrigatória (mandante superior → subordinado)",
      "Causativa de permissão (deixar fazer X)",
      "Causativa de reação emocional: 〜を〜させる (fazer alguém sentir X)",
      // PASSIVA (られる) — from apostila pages 22–25
      "Forma passiva: gr.1 → 〜われる/〜かれる etc., gr.2 → 〜られる, する→される, くる→こられる",
      "Voz passiva básica — sujeito da frase sofre a ação (〜に〜られる)",
      "Passiva de parte do corpo ou pertences afetados (〜に〜を〜られる)",
      "Passiva de inconveniência — falante sofre algo indesejado",
      "Passiva impessoal — fato social sem agente mencionado",
      "Passiva de percepção: 〜と思われます / 〜と考えられます",
      // CONDICIONAIS — standard B6 ICBJ content
      "〜たら (condicional: quando/se X acontecer, Y — resultado único)",
      "〜ば (condicional hipotético formal: se X então Y)",
      "〜と (condicional natural/automático: sempre que X, Y)",
      "〜なら (condicional contextual: se for o caso de X, então Y)",
      "Diferença entre たら・ば・と・なら em contexto",
    ],
    vocabThemes: [
      "Compras e departamentos (#kanji 台用品員場電算器)",
      "Clima e tempo (#kanji 雪雲降着)",
      "Números e cálculos (#kanji 両有利算)",
      "Viagens (#kanji 旅配授業続)",
      "Bairros e cidade (#kanji 渋谷駅供風)",
      "Relações sociais e hierarquia",
      "Expressões de causa e resultado",
      "Sentimentos e reações emocionais",
    ],
    kanji: ["台","用","回","困","使","昨","品","員","弱","場","電","算","器","入","出","止","雪","雲","降","着","荷","選","心","世","立","当","両","有","利","役","画","周","宝","界","計","旅","勉","強","配","授","業","続","名","留","研","究","渋","谷","駅","供","風","島","郎","通","引","達","罪","代","喜","助","持","早","船","首","恩","決","礼","宮","連","背","乗","玉","様","変","類","悲","若"],
    kanjiWithMeaning: [
      {k:"台",m:"contador de máquinas / plataforma"},{k:"用",m:"uso / assunto"},{k:"回",m:"voltar / vez"},{k:"困",m:"estar em apuros"},{k:"使",m:"usar"},{k:"昨",m:"ontem / passado"},{k:"品",m:"produto / qualidade"},{k:"員",m:"membro / funcionário"},{k:"弱",m:"fraco"},{k:"場",m:"lugar / ocasião"},{k:"電",m:"eletricidade"},{k:"算",m:"calcular"},{k:"器",m:"utensílio / recipiente"},{k:"入",m:"entrar"},{k:"出",m:"sair"},{k:"止",m:"parar"},{k:"雪",m:"neve"},{k:"雲",m:"nuvem"},{k:"降",m:"cair (chuva/neve) / descer"},{k:"着",m:"chegar / vestir"},{k:"荷",m:"carga / bagagem"},{k:"選",m:"escolher / selecionar"},{k:"心",m:"coração / mente"},{k:"世",m:"mundo / geração"},{k:"立",m:"ficar de pé"},{k:"当",m:"acertar / responsável"},{k:"両",m:"ambos / dois"},{k:"有",m:"ter / existir"},{k:"利",m:"benefício / lucro"},{k:"役",m:"função / papel"},{k:"画",m:"desenho / plano / filme"},{k:"周",m:"ao redor / semana"},{k:"宝",m:"tesouro"},{k:"界",m:"mundo / campo"},{k:"計",m:"calcular / plano"},{k:"旅",m:"viagem"},{k:"勉",m:"esforço / estudo"},{k:"強",m:"forte"},{k:"配",m:"distribuir / preocupar"},{k:"授",m:"dar / ensinar"},{k:"業",m:"trabalho / negócio"},{k:"続",m:"continuar"},{k:"名",m:"nome / famoso"},{k:"留",m:"ficar / permanecer"},{k:"研",m:"pesquisar / polir"},{k:"究",m:"investigar / aprofundar"},{k:"渋",m:"adstringente / Shibuya"},{k:"谷",m:"vale"},{k:"駅",m:"estação (trem)"},{k:"供",m:"oferecer / criança"},{k:"風",m:"vento / estilo"},{k:"島",m:"ilha"},{k:"郎",m:"jovem / nome masc."},{k:"通",m:"passar / rua"},{k:"引",m:"puxar"},{k:"達",m:"atingir / amigos (plural)"},{k:"罪",m:"crime / culpa"},{k:"代",m:"geração / substituir"},{k:"喜",m:"alegria"},{k:"助",m:"ajudar / salvar"},{k:"持",m:"segurar / ter"},{k:"早",m:"cedo"},{k:"船",m:"barco / navio"},{k:"首",m:"pescoço / cabeça"},{k:"恩",m:"gratidão / favor"},{k:"決",m:"decidir"},{k:"礼",m:"cortesia / agradecimento"},{k:"宮",m:"palácio / santuário"},{k:"連",m:"levar junto / série"},{k:"背",m:"costas / altura"},{k:"乗",m:"embarcar / andar em"},{k:"玉",m:"joia / bola"},{k:"様",m:"forma / senhor(a)"},{k:"変",m:"estranho / mudar"},{k:"類",m:"tipo / categoria"},{k:"悲",m:"tristeza"},{k:"若",m:"jovem"},
    ],
  },
];

/* ══════════ HELPER FUNCTIONS ══════════ */

/** Returns all levels up to and including the given level id (e.g. "B6") */
export function getLevelsUpTo(levelId) {
  const idx = LEVELS.findIndex(l => l.id === levelId);
  if (idx === -1) return LEVELS;
  return LEVELS.slice(0, idx + 1);
}

/** Returns just the target level and the one below it (for 70% focus) */
export function getFocusLevels(levelId) {
  const idx = LEVELS.findIndex(l => l.id === levelId);
  if (idx === -1) return [LEVELS[LEVELS.length - 1]];
  if (idx === 0) return [LEVELS[0]];
  return [LEVELS[idx - 1], LEVELS[idx]]; // e.g. B5 + B6
}

/** Returns all levels below the focus pair (for 30% review) */
export function getReviewLevels(levelId) {
  const idx = LEVELS.findIndex(l => l.id === levelId);
  if (idx <= 1) return [];
  return LEVELS.slice(0, idx - 1); // e.g. B1–B4
}

/** Builds a compact grammar summary string for the AI prompt */
export function grammarSummary(levels) {
  return levels.map(l =>
    `【${l.label}】\n` + l.grammar.join("\n")
  ).join("\n\n");
}

/** Returns all kanji with meanings up to a given level, as a flat array */
export function allKanjiUpTo(levelId) {
  return getLevelsUpTo(levelId).flatMap(l => l.kanjiWithMeaning);
}

/** Builds a kanji reference string for the AI: "日(dia/sol)、月(mês/lua)…" */
export function kanjiReference(levelId) {
  const all = allKanjiUpTo(levelId);
  if (!all.length) return "";
  return all.map(({ k, m }) => `${k}(${m})`).join("、");
}
