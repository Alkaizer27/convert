// Biblioteca de exercícios e treinos padrão.
// g = grupo muscular (usado para sugerir trocas), img = pasta da imagem em img/,
// t = dica de execução, q = busca no YouTube, v = id do vídeo do YouTube (opcional).
window.GROUPS = {
  peito: "Peito", ombro: "Ombro", ombro_post: "Posterior de ombro", triceps: "Tríceps", biceps: "Bíceps",
  costas: "Costas", lombar: "Lombar", abdomen: "Abdômen", quadriceps: "Quadríceps", posterior: "Posterior de coxa",
  gluteo: "Glúteo", abdutor: "Abdutores", adutor: "Adutores", panturrilha: "Panturrilha", cardio: "Cardio"
};

window.LIB = {
  // Peito
  supino_reto: { n: "Supino reto", g: "peito", img: "Barbell_Bench_Press_-_Medium_Grip", t: "Escápulas retraídas, pés firmes. Desça a barra até a linha do mamilo e empurre sem tirar o glúteo do banco.", q: "supino reto barra execução correta", v: "ZN7SuDQpNMk" },
  supino_inclinado_halter: { n: "Supino inclinado com halter", g: "peito", img: "Incline_Dumbbell_Press", t: "Banco a 30–45°. Desça os halteres ao lado do peito, cotovelos levemente para dentro.", q: "supino inclinado halter execução correta", v: "Ky_JXqloq0w" },
  supino_maquina: { n: "Supino máquina", g: "peito", img: "Leverage_Chest_Press", t: "Pegadas na altura do meio do peito. Empurre sem tirar as costas do encosto e volte devagar.", q: "supino máquina execução correta", v: "rfbmQ1os7E8" },
  supino_reto_halter: { n: "Supino reto com halter", g: "peito", img: "Dumbbell_Bench_Press", t: "Halteres alinhados com o peito, desça até sentir alongar e suba aproximando-os no topo.", q: "supino reto halter execução correta" },
  supino_inclinado_maquina: { n: "Supino inclinado máquina", g: "peito", img: "Leverage_Incline_Chest_Press", t: "Ajuste o banco para a pegada ficar na parte de cima do peito. Empurre e volte controlando.", q: "supino inclinado máquina execução correta" },
  crucifixo_halter: { n: "Crucifixo com halter", g: "peito", img: "Dumbbell_Flyes", t: "Cotovelos levemente flexionados e fixos. Abra até alongar o peito e feche como num abraço.", q: "crucifixo halter execução correta" },
  peck_deck: { n: "Voador (peck deck)", g: "peito", img: "Butterfly", t: "Costas apoiadas, cotovelos na altura dos ombros. Feche contraindo o peito e abra devagar.", q: "voador peck deck execução correta" },
  crossover: { n: "Crossover", g: "peito", img: "Cable_Crossover", t: "Tronco levemente inclinado. Traga as mãos à frente do corpo em arco, sem dobrar mais os cotovelos.", q: "crossover polia peito execução correta" },
  flexao: { n: "Flexão de braço", g: "peito", img: "Pushups", t: "Corpo reto, mãos um pouco além dos ombros. Desça o peito até perto do chão. Pode apoiar os joelhos.", q: "flexão de braço execução correta" },

  // Ombro
  desenvolvimento_maquina: { n: "Desenvolvimento máquina", g: "ombro", img: "Machine_Shoulder_Military_Press", t: "Costas apoiadas, punhos alinhados com os cotovelos. Não trave os cotovelos no topo.", q: "desenvolvimento máquina ombro execução", v: "iAdTW8J2ZDk" },
  desenvolvimento_halter: { n: "Desenvolvimento com halter", g: "ombro", img: "Dumbbell_Shoulder_Press", t: "Sentado com as costas apoiadas. Suba os halteres sem bater um no outro e desça até a altura das orelhas.", q: "desenvolvimento halter execução correta", v: "eufDL9MmF8A" },
  arnold: { n: "Desenvolvimento Arnold", g: "ombro", img: "Arnold_Dumbbell_Press", t: "Comece com as palmas viradas para você e gire os punhos enquanto sobe.", q: "desenvolvimento arnold execução correta" },
  elevacao_lateral: { n: "Elevação lateral", g: "ombro", img: "Side_Lateral_Raise", t: "Cotovelos levemente flexionados, suba até a linha do ombro. Controle a descida, sem balanço.", q: "elevação lateral halter execução correta", v: "gURBTU9VSJg" },
  elevacao_lateral_polia: { n: "Elevação lateral na polia", g: "ombro", img: "Cable_Seated_Lateral_Raise", t: "Cabo passando na frente do corpo. Suba até a linha do ombro com o cotovelo levemente dobrado.", q: "elevação lateral polia execução correta" },
  elevacao_frontal: { n: "Elevação frontal", g: "ombro", img: "Front_Dumbbell_Raise", t: "Suba os halteres à frente até a altura dos ombros, sem jogar o tronco para trás.", q: "elevação frontal halter execução correta" },

  // Posterior de ombro
  face_pull: { n: "Posterior de ombro (face pull)", g: "ombro_post", img: "Face_Pull", t: "Polia na altura do rosto. Puxe a corda em direção à testa abrindo os cotovelos para fora e para cima.", q: "face pull corda execução correta", v: "iuTWxNR_i1c" },
  crucifixo_inverso_maquina: { n: "Crucifixo inverso na máquina", g: "ombro_post", img: "Reverse_Machine_Flyes", t: "Peito apoiado, braços quase estendidos. Abra até a linha do corpo e volte devagar.", q: "crucifixo inverso máquina execução correta" },
  crucifixo_inverso_halter: { n: "Crucifixo inverso com halter", g: "ombro_post", img: "Seated_Bent-Over_Rear_Delt_Raise", t: "Tronco inclinado à frente, coluna reta. Abra os braços para os lados até a linha dos ombros.", q: "crucifixo inverso halter execução correta" },

  // Tríceps
  triceps_corda: { n: "Tríceps cross (corda)", g: "triceps", img: "Triceps_Pushdown_-_Rope_Attachment", t: "Cotovelos colados ao corpo. No final, abra a corda para os lados e contraia o tríceps.", q: "tríceps corda polia execução correta", v: "7le1JRUUagM" },
  triceps_barra: { n: "Tríceps cross (barra)", g: "triceps", img: "Triceps_Pushdown", t: "Cotovelos colados ao corpo, estenda os braços até o fim sem mexer os ombros.", q: "tríceps polia barra execução correta", v: "9cmeOVHOjck" },
  triceps_testa: { n: "Tríceps testa", g: "triceps", img: "EZ-Bar_Skullcrusher", t: "Cotovelos apontando para o teto e parados. Desça a barra em direção à testa e estenda.", q: "tríceps testa execução correta" },
  triceps_frances: { n: "Tríceps francês", g: "triceps", img: "Standing_Dumbbell_Triceps_Extension", t: "Halter atrás da cabeça, cotovelos apontados para cima. Estenda sem abrir os cotovelos.", q: "tríceps francês halter execução correta" },
  mergulho_banco: { n: "Mergulho no banco", g: "triceps", img: "Bench_Dips", t: "Mãos no banco atrás do corpo. Desça dobrando os cotovelos para trás até ~90° e suba.", q: "mergulho no banco tríceps execução correta" },
  triceps_coice: { n: "Tríceps coice", g: "triceps", img: "Tricep_Dumbbell_Kickback", t: "Tronco inclinado, braço colado ao corpo. Estenda o antebraço para trás e segure 1 s.", q: "tríceps coice halter execução correta" },

  // Bíceps
  rosca_direta: { n: "Rosca direta", g: "biceps", img: "Barbell_Curl", t: "Cotovelos fixos ao lado do corpo, sem jogar o tronco. Desça controlando até quase estender.", q: "rosca direta barra execução correta", v: "85f7ODu2ztA" },
  rosca_alternada: { n: "Rosca alternada", g: "biceps", img: "Dumbbell_Alternate_Bicep_Curl", t: "Um braço de cada vez, girando o punho para cima enquanto sobe. Cotovelo parado.", q: "rosca alternada halter execução correta" },
  rosca_martelo: { n: "Rosca martelo", g: "biceps", img: "Hammer_Curls", t: "Palmas viradas uma para a outra durante todo o movimento. Cotovelos colados ao corpo.", q: "rosca martelo execução correta" },
  rosca_scott: { n: "Rosca Scott", g: "biceps", img: "Preacher_Curl", t: "Braços apoiados no banco Scott. Não estenda totalmente embaixo para proteger o cotovelo.", q: "rosca scott execução correta" },
  rosca_polia: { n: "Rosca na polia", g: "biceps", img: "Standing_Biceps_Cable_Curl", t: "Polia embaixo, cotovelos fixos. Suba contraindo e desça devagar mantendo a tensão.", q: "rosca bíceps polia execução correta" },

  // Costas
  puxador_triangulo: { n: "Puxador triângulo", g: "costas", img: "V-Bar_Pulldown", t: "Peito aberto, leve inclinação para trás. Puxe o triângulo até o peito levando os cotovelos para baixo.", q: "puxador triângulo pulldown execução correta", v: "uAnrJBnxrZ0" },
  puxador_frente: { n: "Puxador frente", g: "costas", img: "Wide-Grip_Lat_Pulldown", t: "Pegada aberta, peito estufado. Puxe a barra até a parte de cima do peito levando os cotovelos para baixo.", q: "puxador frente pulldown execução correta", v: "BOW9my4J_ek" },
  remada_maquina: { n: "Remada máquina", g: "costas", img: "Leverage_Iso_Row", t: "Peito apoiado, puxe com os cotovelos e junte as escápulas no final. Volte devagar.", q: "remada máquina articulada execução correta", v: "Hcg6W2b5z7M" },
  remada_baixa: { n: "Remada baixa (triângulo)", g: "costas", img: "Seated_Cable_Rows", t: "Coluna reta, puxe o triângulo até o abdômen juntando as escápulas. Não balance o tronco.", q: "remada baixa triângulo execução correta", v: "2YebbYuuBJQ" },
  remada_curvada: { n: "Remada curvada", g: "costas", img: "Bent_Over_Barbell_Row", t: "Tronco inclinado a ~45°, coluna neutra. Puxe a barra até o umbigo.", q: "remada curvada barra execução correta" },
  remada_unilateral: { n: "Remada unilateral (serrote)", g: "costas", img: "One-Arm_Dumbbell_Row", t: "Joelho e mão apoiados no banco. Puxe o halter em direção ao quadril, cotovelo rente ao corpo.", q: "remada unilateral serrote execução correta" },
  barra_fixa: { n: "Barra fixa", g: "costas", img: "Pullups", t: "Pegada um pouco mais aberta que os ombros. Suba até o queixo passar a barra, desça controlando.", q: "barra fixa execução correta" },
  pulldown_braco_reto: { n: "Pulldown braço reto", g: "costas", img: "Straight-Arm_Pulldown", t: "Braços quase estendidos. Leve a barra da altura da cabeça até as coxas usando as costas.", q: "pulldown braço reto polia execução correta" },

  // Lombar
  lombar_maquina: { n: "Lombar máquina", g: "lombar", img: "Hyperextensions_Back_Extensions", t: "Movimento lento, sobe até alinhar o tronco com as pernas — sem hiperestender a coluna.", q: "extensão lombar máquina banco romano execução", v: "R-XcbVbMJF0" },
  superman: { n: "Superman (no chão)", g: "lombar", img: "Superman", t: "Deitado de barriga para baixo, eleve braços e pernas juntos e segure 2 s.", q: "exercício superman lombar execução correta" },

  // Abdômen
  abdominal_reto: { n: "Abdominal reto", g: "abdomen", img: "Crunches", t: "Lombar no chão, suba só até tirar as escápulas. Solte o ar na subida, não puxe o pescoço.", q: "abdominal reto supra execução correta", v: "w08qG9nQZ_Q" },
  abdominal_maquina: { n: "Abdominal máquina", g: "abdomen", img: "Ab_Crunch_Machine", t: "Movimento curto e controlado, enrolando o tronco. Solte o ar ao contrair.", q: "abdominal máquina execução correta", v: "1l0yf6eWh3Y" },
  prancha: { n: "Prancha", g: "abdomen", img: "Plank", t: "Cotovelos abaixo dos ombros, corpo reto da cabeça aos pés. Contraia abdômen e glúteo, sem deixar o quadril cair.", q: "prancha abdominal execução correta", v: "Yu0wjtD5FkU" },
  abdominal_polia: { n: "Abdominal na polia (corda)", g: "abdomen", img: "Cable_Crunch", t: "Ajoelhado, corda ao lado da cabeça. Enrole o tronco levando os cotovelos aos joelhos.", q: "abdominal polia corda execução correta" },
  abdominal_infra: { n: "Abdominal infra", g: "abdomen", img: "Reverse_Crunch", t: "Deitado, traga os joelhos ao peito tirando o quadril do chão. Desça devagar.", q: "abdominal infra execução correta" },
  elevacao_pernas: { n: "Elevação de pernas", g: "abdomen", img: "Flat_Bench_Lying_Leg_Raise", t: "Lombar colada no banco. Suba as pernas estendidas até 90° e desça sem encostar.", q: "elevação de pernas abdominal execução correta" },
  prancha_lateral: { n: "Prancha lateral", g: "abdomen", img: "Side_Bridge", t: "Apoio no antebraço e na lateral do pé. Quadril alto, corpo em linha reta.", q: "prancha lateral execução correta" },

  // Quadríceps
  agachamento_smith: { n: "Agachamento Smith", g: "quadriceps", img: "Smith_Machine_Squat", t: "Pés um pouco à frente da barra. Desça até as coxas ficarem paralelas, joelhos na direção dos pés.", q: "agachamento smith execução correta", v: "_XnQty4d-OM" },
  leg_45: { n: "Leg press 45º", g: "quadriceps", img: "Leg_Press", t: "Pés na largura dos ombros no meio da plataforma. Desça até ~90° sem tirar o quadril do encosto.", q: "leg press 45 execução correta", v: "waAxlYvtCcI" },
  leg_horizontal: { n: "Leg horizontal", g: "quadriceps", img: "Leg_Press", t: "Costas bem apoiadas, pés no meio da plataforma. Dobre até ~90° e empurre sem travar os joelhos.", q: "leg press horizontal execução correta", v: "wFoqZSP0Yug" },
  agachamento_halter: { n: "Agachamento com halter", g: "quadriceps", img: "Dumbbell_Squat", t: "Pés na largura dos ombros, halteres ao lado do corpo. Desça levando o quadril para trás, joelhos na direção dos pés.", q: "agachamento com halter execução correta", v: "3wnMTEVx5-I" },
  agachamento_goblet: { n: "Agachamento goblet", g: "quadriceps", img: "Goblet_Squat", t: "Halter junto ao peito, cotovelos para baixo. Desça entre as pernas mantendo o tronco ereto.", q: "agachamento goblet execução correta" },
  agachamento_livre: { n: "Agachamento livre", g: "quadriceps", img: "Barbell_Squat", t: "Barra apoiada no trapézio, abdômen firme. Desça até as coxas paralelas mantendo a coluna neutra.", q: "agachamento livre barra execução correta" },
  hack: { n: "Hack squat", g: "quadriceps", img: "Hack_Squat", t: "Costas apoiadas, pés no meio da plataforma. Desça até ~90° e suba sem travar os joelhos.", q: "hack squat execução correta" },
  extensora: { n: "Cadeira extensora", g: "quadriceps", img: "Leg_Extensions", t: "Estenda totalmente e segure 1 s no topo. Desça controlando, sem bater o peso.", q: "cadeira extensora execução correta", v: "mruTNzILY3U" },
  afundo: { n: "Afundo com halter", g: "quadriceps", img: "Dumbbell_Lunges", t: "Passo à frente, desça até o joelho de trás quase tocar o chão. Tronco ereto.", q: "afundo halter execução correta", v: "mKRq_p3hQr4" },
  bulgaro: { n: "Agachamento búlgaro", g: "quadriceps", img: "Split_Squat_with_Dumbbells", t: "Pé de trás apoiado no banco. Desça na vertical até a coxa da frente ficar paralela.", q: "agachamento búlgaro execução correta", v: "MzjO0-M-wns" },

  // Posterior de coxa
  stiff: { n: "Stiff", g: "posterior", img: "Stiff-Legged_Barbell_Deadlift", t: "Joelhos levemente flexionados, coluna neutra. Leve o quadril para trás e desça a barra rente às pernas.", q: "stiff barra execução correta", v: "7wOKuiq9tnc" },
  stiff_halter: { n: "Stiff com halter", g: "posterior", img: "Stiff-Legged_Dumbbell_Deadlift", t: "Halteres à frente das coxas. Quadril para trás, coluna reta, desça até sentir alongar o posterior.", q: "stiff halter execução correta" },
  levantamento_romeno: { n: "Levantamento terra romeno", g: "posterior", img: "Romanian_Deadlift", t: "Parecido com o stiff, mas com mais flexão de joelho. Barra rente ao corpo o tempo todo.", q: "levantamento terra romeno execução correta" },
  cadeira_flexora: { n: "Cadeira flexora", g: "posterior", img: "Seated_Leg_Curl", t: "Joelho alinhado ao eixo da máquina. Flexione até o fim e volte devagar.", q: "cadeira flexora execução correta", v: "CHsaztLSSrc" },
  mesa_flexora: { n: "Mesa flexora", g: "posterior", img: "Lying_Leg_Curls", t: "Quadril colado no banco. Flexione até o fim e volte devagar, sem deixar o peso bater.", q: "mesa flexora execução correta", v: "8Nat6GRiEoc" },
  flexora_em_pe: { n: "Flexora em pé (unilateral)", g: "posterior", img: "Standing_Leg_Curl", t: "Uma perna de cada vez. Flexione o joelho levando o calcanhar ao glúteo, sem mexer o quadril.", q: "flexora em pé unilateral execução correta" },

  // Glúteo
  elevacao_quadril: { n: "Elevação de quadril", g: "gluteo", img: "Barbell_Hip_Thrust", t: "Costas apoiadas no banco, pés firmes. Suba o quadril até alinhar com o tronco e aperte o glúteo 1 s no topo.", q: "elevação de quadril hip thrust execução correta", v: "Zp26q4BY5HE" },
  gluteo_maquina: { n: "Glúteo máquina", g: "gluteo", img: "Glute_Kickback", t: "Abdômen firme, chute a perna para trás sem arquear a lombar. Foque em contrair o glúteo.", q: "glúteo máquina coice execução correta", v: "lJqJvUXuVyc" },
  ponte_gluteo: { n: "Ponte de glúteo", g: "gluteo", img: "Barbell_Glute_Bridge", t: "Deitada no chão, pés perto do quadril. Suba o quadril apertando o glúteo e segure 1 s.", q: "ponte de glúteo execução correta" },
  ponte_unilateral: { n: "Ponte unilateral", g: "gluteo", img: "Single_Leg_Glute_Bridge", t: "Uma perna estendida no ar. Suba o quadril com a outra, sem deixar a bacia girar.", q: "ponte de glúteo unilateral execução correta" },
  coice_polia: { n: "Coice na polia", g: "gluteo", img: "One-Legged_Cable_Kickback", t: "Tornozeleira na polia baixa. Leve a perna para trás sem arquear as costas.", q: "coice glúteo polia execução correta", v: "S2_Rsx-Ud2w" },
  subida_banco: { n: "Subida no banco (step-up)", g: "gluteo", img: "Dumbbell_Step_Ups", t: "Pé inteiro no banco. Suba empurrando pelo calcanhar e desça devagar.", q: "subida no banco step up execução correta" },
  agachamento_sumo: { n: "Agachamento sumô", g: "gluteo", img: "Plie_Dumbbell_Squat", t: "Pés bem afastados e pontas para fora. Desça com o halter entre as pernas, joelhos abertos.", q: "agachamento sumô halter execução correta", v: "u_TTcv8FvOk" },

  // Abdutores / adutores
  abdutora: { n: "Cadeira abdutora", g: "abdutor", img: "Thigh_Abductor", t: "Tronco levemente inclinado à frente ativa mais o glúteo. Abra e feche de forma controlada.", q: "cadeira abdutora execução correta", v: "50qHGus1TZk" },
  caminhada_lateral: { n: "Caminhada lateral com elástico", g: "abdutor", img: "Monster_Walk", t: "Elástico nos joelhos ou tornozelos, semi-agachado. Passos laterais sem juntar os pés.", q: "caminhada lateral elástico glúteo execução" },
  abducao_deitada: { n: "Abdução deitada", g: "abdutor", img: "Side_Leg_Raises", t: "Deitada de lado, suba a perna de cima estendida até ~45° e desça devagar.", q: "abdução de quadril deitada execução correta" },
  adutora: { n: "Cadeira adutora", g: "adutor", img: "Thigh_Adductor", t: "Feche as pernas de forma controlada, segure 1 s e abra devagar.", q: "cadeira adutora execução correta", v: "uTIog2r9flM" },
  aducao_polia: { n: "Adução na polia", g: "adutor", img: "Cable_Hip_Adduction", t: "Tornozeleira na polia baixa. Cruze a perna à frente da outra de forma controlada.", q: "adução de quadril polia execução correta" },

  // Panturrilha
  panturrilha_em_pe: { n: "Panturrilha em pé", g: "panturrilha", img: "Standing_Calf_Raises", t: "Amplitude total: desça alongando bem e suba na ponta dos pés, pausando 1 s no topo.", q: "panturrilha em pé máquina execução correta", v: "qWHH0We_9r0" },
  panturrilha_sentada: { n: "Panturrilha sentada", g: "panturrilha", img: "Seated_Calf_Raise", t: "Joelhos sob o apoio. Desça o calcanhar o máximo possível e suba na ponta dos pés.", q: "panturrilha sentada máquina execução correta", v: "UqsUaoE3SSs" },
  panturrilha_leg: { n: "Panturrilha no leg press", g: "panturrilha", img: "Calf_Press_On_The_Leg_Press_Machine", t: "Só a ponta dos pés na plataforma, joelhos quase estendidos. Empurre com a ponta dos pés.", q: "panturrilha no leg press execução correta" },
  panturrilha_smith: { n: "Panturrilha no Smith", g: "panturrilha", img: "Smith_Machine_Calf_Raise", t: "Ponta dos pés num step, barra nos ombros. Suba e desça com amplitude total.", q: "panturrilha smith execução correta", v: "qTp6CNYiwjc" },

  // Cardio
  esteira: { n: "Esteira inclinada", g: "cardio", img: "Walking_Treadmill", t: "Caminhada em ritmo firme com inclinação. Evite segurar nas barras laterais.", q: "caminhada esteira inclinada" },
  bicicleta: { n: "Bicicleta", g: "cardio", img: "Bicycling_Stationary", t: "Banco na altura do quadril: joelho quase estendido no ponto mais baixo do pedal.", q: "bicicleta ergométrica postura correta" },
  escada: { n: "Escada", g: "cardio", img: "Stairmaster", t: "Tronco ereto, apoie o pé inteiro no degrau. Use as barras só para equilíbrio.", q: "simulador de escada academia postura" },
  eliptico: { n: "Elíptico", g: "cardio", img: "Elliptical_Trainer", t: "Postura ereta, empurre e puxe as alças acompanhando as pernas.", q: "elíptico academia postura correta" },
  remo: { n: "Remo ergômetro", g: "cardio", img: "Rowing_Stationary", t: "Empurre primeiro com as pernas, depois puxe com os braços. Volte na ordem inversa.", q: "remo ergômetro técnica correta" },
  bike_horizontal: { n: "Bicicleta horizontal", g: "cardio", img: "Recumbent_Bike", t: "Costas apoiadas, joelho quase estendido no ponto mais distante.", q: "bicicleta horizontal academia" }
};

// Treinos padrão. s = séries, r = repetições (ou tempo), tag = aviso extra.
window.DEFAULT_PLANS = {
  charles: {
    name: "Charles", title: "Treino ABC",
    workouts: [
      { id: "A", name: "Treino A", sub: "Peito · Ombro · Tríceps · Abdômen",
        note: "Cortei: crucifixo (peito já tem 2 exercícios) e tríceps testa (supino e ombro já cansam bastante o tríceps).",
        items: [
          { ex: "supino_reto", s: 4, r: "8-12" },
          { ex: "supino_inclinado_halter", s: 3, r: "8-12" },
          { ex: "desenvolvimento_maquina", s: 3, r: "8-12" },
          { ex: "elevacao_lateral", s: 3, r: "8-12" },
          { ex: "triceps_corda", s: 3, r: "8-12" },
          { ex: "abdominal_reto", s: 3, r: "15" }
        ] },
      { id: "B", name: "Treino B", sub: "Costas · Ombro · Bíceps · Lombar",
        note: "Cortei: remada baixa (repete a remada máquina) e Scott (costas já trabalham bastante o bíceps).",
        items: [
          { ex: "puxador_triangulo", s: 4, r: "8-12" },
          { ex: "remada_maquina", s: 4, r: "8-12" },
          { ex: "face_pull", s: 3, r: "12" },
          { ex: "rosca_direta", n: "Rosca direta barra", s: 3, r: "12" },
          { ex: "lombar_maquina", s: 3, r: "12-15" }
        ] },
      { id: "C", name: "Treino C", sub: "Perna · Glúteo",
        note: "Cortei: leg 45º (já tem agachamento + extensora), uma das panturrilhas e 3 séries da abdutora. Se preferir, troque o agachamento Smith pelo leg 45º.",
        items: [
          { ex: "agachamento_smith", s: 4, r: "8-10" },
          { ex: "stiff", s: 3, r: "8-10" },
          { ex: "cadeira_flexora", s: 3, r: "10-12" },
          { ex: "extensora", s: 3, r: "12-15" },
          { ex: "abdutora", s: 3, r: "15" },
          { ex: "panturrilha_em_pe", n: "Panturrilha (leg ou banco)", s: 4, r: "15" }
        ] }
    ]
  },
  joelma: {
    name: "Joelma", title: "Treino 1·2·3",
    workouts: [
      { id: "1", name: "Treino 1", sub: "Pernas (frente) · Glúteo",
        items: [
          { ex: "agachamento_halter", s: 3, r: "12" },
          { ex: "leg_horizontal", s: 3, r: "12" },
          { ex: "extensora", s: 3, r: "12" },
          { ex: "abdutora", s: 3, r: "15" },
          { ex: "prancha", s: 3, r: "30s" },
          { ex: "esteira", s: 1, r: "10 min" }
        ] },
      { id: "2", name: "Treino 2", sub: "Parte de cima",
        items: [
          { ex: "puxador_frente", s: 3, r: "12" },
          { ex: "remada_baixa", s: 3, r: "12" },
          { ex: "supino_maquina", s: 3, r: "12" },
          { ex: "desenvolvimento_maquina", s: 3, r: "12" },
          { ex: "elevacao_lateral", s: 3, r: "12" },
          { ex: "rosca_direta", s: 3, r: "12", tag: "Bi-set: emende com o próximo, sem descanso", bs: 1 },
          { ex: "triceps_barra", n: "Tríceps cross", s: 3, r: "12", tag: "Bi-set: descanse depois deste" },
          { ex: "abdominal_maquina", s: 3, r: "15" },
          { ex: "bicicleta", s: 1, r: "10 min" }
        ] },
      { id: "3", name: "Treino 3", sub: "Glúteo · Posterior",
        items: [
          { ex: "elevacao_quadril", s: 3, r: "12" },
          { ex: "gluteo_maquina", s: 3, r: "12" },
          { ex: "mesa_flexora", s: 3, r: "12" },
          { ex: "adutora", s: 3, r: "12" },
          { ex: "panturrilha_sentada", n: "Panturrilha", s: 3, r: "15" },
          { ex: "escada", s: 1, r: "10 min" }
        ] }
    ]
  }
};
