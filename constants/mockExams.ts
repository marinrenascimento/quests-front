import { Exam, Question } from '@/constants/exams';

// TODO: substituir pelos dados do back. Provas e questões fictícias, num lugar só: a quantidade de
// questões de cada prova (mostrada em Minhas Provas) é derivada da lista de questões dela, então a
// contagem e a lista nunca divergem.

/** Conteúdo de uma questão, sem os ids (que dependem da prova e da posição) */
type QuestionBase = Pick<
  Question,
  'discipline' | 'topic' | 'statement' | 'difficulty' | 'alternatives'
>;

/**
 * Prova fictícia antes de montar as questões: `size` é quantas questões gerar a partir da
 * lista-base; `questions`, as questões escritas à mão para ela (usadas no lugar da geração).
 */
type ExamSeed = Pick<Exam, 'id' | 'title'> &
  ({ size: number; questions?: never } | { questions: QuestionBase[]; size?: never });

/**
 * Simulado de Matemática: 9 questões escritas à mão, todas de Matemática. As duas primeiras
 * reproduzem o mockup da realização de prova.
 */
const MATH_MOCK_QUESTIONS: QuestionBase[] = [
  {
    discipline: 'Matemática',
    topic: 'Aritmética',
    statement: 'Qual é o menor número primo maior que 15?',
    difficulty: 'facil',
    alternatives: ['11', '13', '15', '17', '19'],
  },
  {
    discipline: 'Matemática',
    topic: 'Geometria',
    statement:
      'Uma praça será construída no formato de um círculo de diâmetro medindo 12 metros. Para preservação da área verde da cidade, a prefeitura determinou que 60% dessa praça deve ser composta por área verde. Utilizando π = 3,1, podemos afirmar que a área verde da praça mede, em metros quadrados, aproximadamente:',
    difficulty: 'medio',
    alternatives: ['112', '97', '82', '78', '67'],
  },
  {
    discipline: 'Matemática',
    topic: 'Porcentagem',
    statement:
      'Em uma loja, uma camisa que custava R$ 120,00 entrou em promoção com 25% de desconto. Qual é o preço da camisa durante a promoção?',
    difficulty: 'facil',
    alternatives: ['R$ 80,00', 'R$ 90,00', 'R$ 95,00', 'R$ 100,00', 'R$ 105,00'],
  },
  {
    discipline: 'Matemática',
    topic: 'Equações do 1º grau',
    statement:
      'Ana tem o triplo da idade de seu sobrinho. Daqui a 10 anos, a soma das idades dos dois será de 60 anos. Qual é a idade atual de Ana?',
    difficulty: 'facil',
    alternatives: ['20 anos', '25 anos', '30 anos', '35 anos', '40 anos'],
  },
  {
    discipline: 'Matemática',
    topic: 'Probabilidade',
    statement:
      'Uma urna contém 4 bolas vermelhas, 6 azuis e 10 brancas, todas iguais exceto pela cor. Retirando-se uma bola ao acaso, qual é a probabilidade de que ela não seja branca?',
    difficulty: 'medio',
    alternatives: ['1/5', '3/10', '2/5', '1/2', '3/5'],
  },
  {
    discipline: 'Matemática',
    topic: 'Funções do 2º grau',
    statement:
      'O lucro mensal de uma pequena fábrica, em milhares de reais, é dado por L(x) = -x² + 12x - 20, em que x é o número de lotes produzidos no mês. Qual é o lucro máximo mensal que a fábrica pode obter, em milhares de reais?',
    difficulty: 'dificil',
    alternatives: ['6', '12', '16', '20', '36'],
  },
  {
    discipline: 'Matemática',
    topic: 'Progressões',
    statement:
      'Uma pessoa decidiu economizar guardando R$ 50,00 no primeiro mês e, a cada mês seguinte, R$ 20,00 a mais do que no mês anterior. Quanto ela terá guardado ao final de 12 meses?',
    difficulty: 'medio',
    alternatives: ['R$ 1.560,00', 'R$ 1.740,00', 'R$ 1.920,00', 'R$ 2.040,00', 'R$ 2.280,00'],
  },
  {
    discipline: 'Matemática',
    topic: 'Trigonometria',
    statement:
      'Uma rampa de acesso de 8 metros de comprimento forma um ângulo de 30° com o chão, que é plano e horizontal. Qual é a altura, em metros, que o topo da rampa alcança em relação ao chão?',
    difficulty: 'dificil',
    alternatives: ['2', '4', '4√3', '6', '8'],
  },
  {
    discipline: 'Matemática',
    topic: 'Estatística',
    statement:
      'As notas de um aluno em cinco provas de um bimestre foram 6,0; 7,5; 8,0; 5,5 e 8,0. Qual é a média aritmética dessas notas?',
    difficulty: 'facil',
    alternatives: ['6,5', '7,0', '7,5', '8,0', '8,5'],
  },
];

/**
 * Provas fictícias. As 6 primeiras são as do mockup de Minhas Provas, na ordem dele; depois vem o
 * Simulado de Matemática (escrito à mão); as seguintes testam a rolagem, o nome longo e o
 * singular ("1 QUESTÃO"); as 8 últimas são vestibulares (com uma prova de 1 questão e uma vazia,
 * para o estado vazio).
 */
const EXAM_SEEDS: ExamSeed[] = [
  { id: 'substantivos-adjetivos', title: 'Substantivos e Adjetivos', size: 53 },
  { id: 'sistema-nervoso', title: 'Sistema Nervoso', size: 15 },
  { id: 'primeira-guerra', title: 'Primeira Guerra Mundial', size: 27 },
  { id: 'renascimento', title: 'Renascimento', size: 231 },
  { id: 'radiciacao-potenciacao', title: 'Radiciação e Potenciação', size: 5 },
  { id: 'guerra-fria', title: 'Guerra Fria', size: 38 },
  { id: 'simulado-matematica', title: 'Simulado de Matemática', questions: MATH_MOCK_QUESTIONS },
  { id: 'funcoes-primeiro-grau', title: 'Funções do 1º Grau', size: 42 },
  { id: 'tabela-periodica', title: 'Tabela Periódica', size: 64 },
  {
    id: 'interpretacao-textos',
    title: 'Interpretação de Textos Literários e Não Literários do Enem',
    size: 120,
  },
  { id: 'leis-de-newton', title: 'Leis de Newton', size: 19 },
  { id: 'ecologia', title: 'Ecologia', size: 1 },
  { id: 'brasil-colonia', title: 'Brasil Colônia', size: 33 },
  { id: 'modernismo', title: 'Modernismo', size: 48 },
  { id: 'geometria-plana', title: 'Geometria Plana', size: 76 },
  { id: 'revolucao-industrial', title: 'Revolução Industrial', size: 26 },
  { id: 'verb-tenses', title: 'Inglês: Verb Tenses', size: 12 },
  { id: 'estequiometria', title: 'Estequiometria', size: 9 },
  { id: 'enem-2023-dia-1', title: 'ENEM 2023 - 1º Dia', size: 90 },
  { id: 'enem-2023-dia-2', title: 'ENEM 2023 - 2º Dia', size: 90 },
  { id: 'fuvest-2024-fase-1', title: 'FUVEST 2024 - 1ª Fase', size: 90 },
  { id: 'ita-2023-fase-1', title: 'ITA 2023 - 1ª Fase', size: 40 },
  { id: 'unicamp-2024-fase-1', title: 'UNICAMP 2024 - 1ª Fase', size: 72 },
  { id: 'uerj-2024-qualificacao', title: 'UERJ 2024 - Exame de Qualificação', size: 24 },
  { id: 'ufsc-2023', title: 'UFSC 2023', size: 1 },
  { id: 'uel-2023', title: 'UEL 2023', size: 0 },
];

/**
 * Questões-base, na ordem em que entram nas provas geradas: as disciplinas se alternam e as
 * dificuldades também (quaisquer 3 seguidas têm as 3 dificuldades), para cada prova ter
 * variedade. Enunciado completo, no estilo de vestibular, e 5 alternativas curtas.
 */
const QUESTION_BASES: QuestionBase[] = [
  {
    discipline: 'Matemática',
    topic: 'Equações do 1º grau',
    statement:
      'Em uma gincana escolar, cada equipe ganha 3 pontos por tarefa concluída, além de um bônus fixo de 7 pontos pela inscrição. Uma equipe terminou a gincana com 22 pontos. Sendo x o número de tarefas concluídas, qual é o valor de x na equação 3x + 7 = 22?',
    difficulty: 'facil',
    alternatives: ['3', '4', '5', '6', '7'],
  },
  {
    discipline: 'Português',
    topic: 'Concordância verbal',
    statement:
      'Quando o sujeito composto vem depois do verbo, a norma-padrão admite que o verbo concorde com o núcleo mais próximo ou vá para o plural. Considerando a norma-padrão, em qual das frases abaixo a concordância verbal está correta?',
    difficulty: 'medio',
    alternatives: [
      'Haviam muitas pessoas na fila.',
      'Fazem dez anos que não o vejo.',
      'Chegou atrasados o pai e o filho.',
      'Saíram cedo o pai e o filho.',
      'Existe muitos motivos para isso.',
    ],
  },
  {
    discipline: 'História',
    topic: 'Revolução Francesa',
    statement:
      'Em 1789, a França enfrentava uma grave crise financeira, agravada pelos gastos com guerras e pela isenção de impostos do clero e da nobreza. Para tentar resolver o problema, o rei Luís XVI convocou os Estados Gerais. Que papel a burguesia teve nesse processo?',
    difficulty: 'dificil',
    alternatives: [
      'Defendeu a manutenção dos privilégios',
      'Liderou o Terceiro Estado por reformas',
      'Apoiou o fortalecimento do absolutismo',
      'Recusou-se a participar da assembleia',
      'Aliou-se ao clero contra os camponeses',
    ],
  },
  {
    discipline: 'Geografia',
    topic: 'Climas do Brasil',
    statement:
      'O sertão nordestino apresenta chuvas escassas e irregulares, concentradas em poucos meses do ano, temperaturas elevadas o ano inteiro e longos períodos de estiagem. Qual tipo de clima predomina nessa região do Brasil?',
    difficulty: 'facil',
    alternatives: ['Equatorial úmido', 'Subtropical', 'Semiárido', 'Tropical de altitude', 'Temperado'],
  },
  {
    discipline: 'Física',
    topic: 'Cinemática',
    statement:
      'Durante uma viagem, um carro percorre 120 km em 1,5 h, sem paradas. Em seguida, o motorista para por 30 minutos em um posto e depois percorre mais 60 km em 1 h. Considerando apenas o primeiro trecho, qual é a velocidade média do carro, em km/h?',
    difficulty: 'medio',
    alternatives: ['60', '72', '80', '90', '100'],
  },
  {
    discipline: 'Química',
    topic: 'Estequiometria',
    statement:
      'O metano (CH4), principal componente do gás natural, sofre combustão completa segundo a equação CH4 + 2 O2 → CO2 + 2 H2O. Em um experimento, foram queimados completamente 2 mols de metano com excesso de oxigênio. Quantos mols de água se formam nessa reação?',
    difficulty: 'dificil',
    alternatives: ['1 mol', '2 mols', '3 mols', '4 mols', '6 mols'],
  },
  {
    discipline: 'Biologia',
    topic: 'Citologia',
    statement:
      'As células eucarióticas possuem diversas organelas com funções específicas. Uma delas tem dupla membrana, DNA próprio e produz a maior parte do ATP da célula. Qual organela celular é responsável pela respiração celular?',
    difficulty: 'facil',
    alternatives: [
      'Ribossomo',
      'Mitocôndria',
      'Complexo golgiense',
      'Lisossomo',
      'Retículo endoplasmático',
    ],
  },
  {
    discipline: 'Matemática',
    topic: 'Porcentagem',
    statement:
      'Uma loja aumentou em 15% o preço de um produto que custava R$ 80,00. Um mês depois, anunciou uma promoção com 10% de desconto sobre o novo preço. Antes da promoção, qual era o novo preço do produto?',
    difficulty: 'medio',
    alternatives: ['R$ 88,00', 'R$ 90,00', 'R$ 92,00', 'R$ 95,00', 'R$ 96,00'],
  },
  {
    discipline: 'Português',
    topic: 'Figuras de linguagem',
    statement:
      'Leia o trecho: "Quando o professor anunciou a prova surpresa, o silêncio gritava naquela sala, e cada aluno parecia ouvir o próprio coração." Qual figura de linguagem aparece na expressão "o silêncio gritava naquela sala"?',
    difficulty: 'dificil',
    alternatives: ['Metonímia', 'Paradoxo', 'Hipérbato', 'Eufemismo', 'Pleonasmo'],
  },
  {
    discipline: 'História',
    topic: 'Era Vargas',
    statement:
      'Em 1930, a eleição de Júlio Prestes foi contestada por grupos políticos de Minas Gerais, do Rio Grande do Sul e da Paraíba, reunidos na Aliança Liberal. O conflito pôs fim à Primeira República. Qual movimento levou Getúlio Vargas ao poder em 1930?',
    difficulty: 'facil',
    alternatives: [
      'Revolta da Vacina',
      'Revolução de 1930',
      'Intentona Comunista',
      'Revolução Constitucionalista',
      'Golpe do Estado Novo',
    ],
  },
  {
    discipline: 'Geografia',
    topic: 'Urbanização',
    statement:
      'Com o crescimento das metrópoles brasileiras, cidades vizinhas se expandiram até que seus limites urbanos se encontraram, formando uma mancha urbana contínua, como ocorre entre São Paulo e os municípios do ABC. Como se chama esse processo?',
    difficulty: 'medio',
    alternatives: ['Metropolização', 'Conurbação', 'Gentrificação', 'Êxodo rural', 'Megalópole'],
  },
  {
    discipline: 'Física',
    topic: 'Eletrodinâmica',
    statement:
      'Em um circuito, três resistores idênticos de 6 Ω são ligados em paralelo, e o conjunto é conectado a uma bateria ideal de 12 V. Desprezando a resistência dos fios, qual é a resistência equivalente da associação e a corrente total fornecida pela bateria?',
    difficulty: 'dificil',
    alternatives: ['2 Ω e 6 A', '3 Ω e 4 A', '6 Ω e 2 A', '18 Ω e 0,67 A', '2 Ω e 3 A'],
  },
  {
    discipline: 'Química',
    topic: 'Tabela periódica',
    statement:
      'Na tabela periódica, os símbolos dos elementos nem sempre correspondem ao nome em português, pois muitos vêm do latim. É o caso do sódio, metal alcalino presente no sal de cozinha. Qual é o símbolo do sódio na tabela periódica?',
    difficulty: 'facil',
    alternatives: ['So', 'Sd', 'Na', 'S', 'Nb'],
  },
  {
    discipline: 'Biologia',
    topic: 'Genética',
    statement:
      'Em uma espécie de planta, o alelo A determina flores vermelhas e é dominante sobre o alelo a, que determina flores brancas. Duas plantas heterozigotas (Aa) foram cruzadas. Qual é a probabilidade de nascer um descendente com flores brancas (aa)?',
    difficulty: 'medio',
    alternatives: ['0%', '25%', '50%', '75%', '100%'],
  },
  {
    discipline: 'Matemática',
    topic: 'Funções do 2º grau',
    statement:
      'Considere a função f(x) = x² - 5x + 6, cujo gráfico é uma parábola com a concavidade voltada para cima. Os pontos em que essa parábola intercepta o eixo das abscissas correspondem às raízes da função. Quais são as raízes de f?',
    difficulty: 'dificil',
    alternatives: ['1 e 6', '2 e 3', '-2 e -3', '-1 e 6', '0 e 5'],
  },
  {
    discipline: 'Português',
    topic: 'Classes de palavras',
    statement:
      'Na frase "Ele saiu rapidamente da sala ao ouvir o sinal", a palavra "rapidamente" indica a maneira como a ação de sair aconteceu, modificando o sentido do verbo. Qual é a classe gramatical da palavra "rapidamente" nessa frase?',
    difficulty: 'facil',
    alternatives: ['Adjetivo', 'Advérbio', 'Substantivo', 'Preposição', 'Conjunção'],
  },
  {
    discipline: 'História',
    topic: 'Guerra Fria',
    statement:
      'Em outubro de 1962, aviões espiões dos Estados Unidos fotografaram bases de mísseis soviéticos em construção em Cuba, a poucos quilômetros da Flórida. O episódio levou o mundo perto de uma guerra nuclear. O que foi a Crise dos Mísseis no contexto da Guerra Fria?',
    difficulty: 'medio',
    alternatives: [
      'Um acordo comercial entre EUA e URSS',
      'Um impasse militar entre EUA e URSS',
      'Uma revolta popular em Cuba',
      'A queda do Muro de Berlim',
      'A corrida espacial pela Lua',
    ],
  },
  {
    discipline: 'Geografia',
    topic: 'Cartografia',
    statement:
      'Um estudante mediu, em um mapa de escala 1:50.000, a distância em linha reta entre duas cidades e encontrou 4 cm. Ele precisa da distância real em quilômetros para planejar uma viagem de bicicleta. Quantos quilômetros reais correspondem a 4 cm nesse mapa?',
    difficulty: 'dificil',
    alternatives: ['0,2 km', '2 km', '20 km', '200 km', '2.000 km'],
  },
  {
    discipline: 'Física',
    topic: 'Leis de Newton',
    statement:
      'Ao disparar, uma arma empurra o projétil para a frente e, ao mesmo tempo, sofre um empurrão para trás, conhecido como recuo, que é sentido no ombro de quem atira. Qual lei de Newton explica o recuo de uma arma no momento do disparo?',
    difficulty: 'facil',
    alternatives: [
      'Lei da inércia',
      'Princípio fundamental',
      'Lei da ação e reação',
      'Lei da gravitação',
      'Lei de Hooke',
    ],
  },
  {
    discipline: 'Química',
    topic: 'Soluções',
    statement:
      'Para preparar um soro caseiro, uma pessoa dissolveu 20 g de sal em água suficiente para obter 500 mL de solução e guardou a mistura em uma garrafa limpa. Qual é a concentração comum dessa solução, em gramas por litro?',
    difficulty: 'medio',
    alternatives: ['4 g/L', '10 g/L', '20 g/L', '40 g/L', '100 g/L'],
  },
  {
    discipline: 'Biologia',
    topic: 'Ecologia',
    statement:
      'Em uma cadeia alimentar formada por capim, gafanhoto, sapo e cobra, apenas cerca de 10% da energia de um nível trófico é transferida para o seguinte. Por que a energia disponível diminui a cada nível trófico de uma cadeia alimentar?',
    difficulty: 'dificil',
    alternatives: [
      'Parte é perdida como calor',
      'A energia é reciclada pelo solo',
      'Os predadores produzem energia',
      'Os produtores consomem a energia',
      'A luz solar diminui ao longo do dia',
    ],
  },
];

/** Deslocamento do início da lista-base de uma prova para a seguinte (provas começam diferente) */
const START_STEP = 5;

/**
 * Questões de uma prova, determinísticas (ids estáveis, sem aleatoriedade). Com questões escritas
 * à mão, usa elas, na ordem. Senão, gera exatamente seed.size questões a partir da lista-base,
 * começando num ponto que depende da posição da prova; quando a quantidade passa da lista-base,
 * ela se repete (mesmo enunciado e alternativas) com o número da repetição no final do enunciado
 * ("... (2)", "... (3)").
 */
function buildQuestions(seed: ExamSeed, examIndex: number): Question[] {
  if (seed.questions) {
    return seed.questions.map((base, index) => ({
      ...base,
      id: `${seed.id}-q${index + 1}`,
      examId: seed.id,
    }));
  }

  const start = (examIndex * START_STEP) % QUESTION_BASES.length;
  return Array.from({ length: seed.size }, (_, index) => {
    const base = QUESTION_BASES[(start + index) % QUESTION_BASES.length];
    const round = Math.floor(index / QUESTION_BASES.length);
    return {
      ...base,
      id: `${seed.id}-q${index + 1}`,
      examId: seed.id,
      statement: round === 0 ? base.statement : `${base.statement} (${round + 1})`,
    };
  });
}

/** Questões de cada prova, por id da prova (montadas uma vez, ao carregar o arquivo) */
export const MOCK_EXAM_QUESTIONS: Record<string, Question[]> = Object.fromEntries(
  EXAM_SEEDS.map((seed, index) => [seed.id, buildQuestions(seed, index)]),
);

/** Provas fictícias, com a quantidade de questões derivada da lista de cada uma */
export const MOCK_EXAMS: Exam[] = EXAM_SEEDS.map(({ id, title }) => ({
  id,
  title,
  questionsCount: MOCK_EXAM_QUESTIONS[id].length,
}));
