import type { GameDifficulty, WordSearchQuestion } from '@/constants/games';

// TODO: se as perguntas passarem a vir do back (RN-309), substituir por elas. Hoje a lista fica só
// no app. Para acrescentar uma pergunta: a resposta precisa ser uma palavra só, sem espaço nem hífen,
// e caber na grade do nível (Fácil até 8 letras, Médio até 10 e Difícil até 12). Uma resposta não
// pode repetir, nem estar dentro de outra do mesmo nível.

/** Perguntas do Caça-Palavras por nível (RN-305): biologia e química */
export const MOCK_WORD_SEARCH_QUESTIONS: Record<GameDifficulty, WordSearchQuestion[]> = {
  facil: [
    { subject: 'biologia', question: 'Qual órgão bombeia o sangue pelo corpo?', answer: 'coração' },
    { subject: 'biologia', question: 'Que gás as plantas liberam na fotossíntese?', answer: 'oxigênio' },
    { subject: 'biologia', question: 'Em que órgão acontecem as trocas gasosas da respiração humana?', answer: 'pulmão' },
    { subject: 'biologia', question: 'Qual é a unidade básica dos seres vivos?', answer: 'célula' },
    { subject: 'biologia', question: 'Que parte da planta absorve a água do solo?', answer: 'raiz' },
    { subject: 'biologia', question: 'Que parte da planta costuma fazer a fotossíntese?', answer: 'folha' },
    { subject: 'biologia', question: 'Qual órgão comanda o sistema nervoso?', answer: 'cérebro' },
    { subject: 'quimica', question: 'Que substância tem a fórmula H2O?', answer: 'água' },
    { subject: 'quimica', question: 'Qual metal é líquido na temperatura ambiente?', answer: 'mercúrio' },
    { subject: 'quimica', question: 'Que metal tem o símbolo Fe?', answer: 'ferro' },
    { subject: 'quimica', question: 'Que metal tem o símbolo Au?', answer: 'ouro' },
    { subject: 'quimica', question: 'Que metal tem o símbolo Ag?', answer: 'prata' },
    { subject: 'quimica', question: 'Qual partícula do átomo tem carga negativa?', answer: 'elétron' },
  ],
  medio: [
    { subject: 'biologia', question: 'Que pigmento verde capta a luz nas plantas?', answer: 'clorofila' },
    { subject: 'biologia', question: 'Que parte da célula guarda o material genético?', answer: 'núcleo' },
    { subject: 'biologia', question: 'Qual célula do sangue transporta o oxigênio?', answer: 'hemácia' },
    { subject: 'biologia', question: 'Qual é a sigla da molécula que guarda a informação genética?', answer: 'DNA' },
    { subject: 'biologia', question: 'Qual órgão produz a bile?', answer: 'fígado' },
    { subject: 'biologia', question: 'Como se chama o animal que se alimenta só de plantas?', answer: 'herbívoro' },
    { subject: 'biologia', question: 'Qual hormônio ajuda a controlar o açúcar no sangue?', answer: 'insulina' },
    { subject: 'biologia', question: 'Qual célula transmite os impulsos nervosos?', answer: 'neurônio' },
    { subject: 'quimica', question: 'Qual gás existe em maior quantidade no ar?', answer: 'nitrogênio' },
    { subject: 'quimica', question: 'Qual partícula do átomo tem carga positiva?', answer: 'próton' },
    { subject: 'quimica', question: 'Qual partícula do núcleo do átomo não tem carga?', answer: 'nêutron' },
    { subject: 'quimica', question: 'Qual é o elemento mais leve da tabela periódica?', answer: 'hidrogênio' },
    { subject: 'quimica', question: 'Que metal tem o símbolo Na?', answer: 'sódio' },
    { subject: 'quimica', question: 'Que metal tem o símbolo Cu?', answer: 'cobre' },
    { subject: 'quimica', question: 'Que elemento forma o carvão e o diamante?', answer: 'carbono' },
  ],
  dificil: [
    { subject: 'biologia', question: 'Qual organela produz a maior parte da energia da célula?', answer: 'mitocôndria' },
    { subject: 'biologia', question: 'Como se chama o processo em que a planta produz o próprio alimento?', answer: 'fotossíntese' },
    { subject: 'biologia', question: 'Qual estrutura da célula produz as proteínas?', answer: 'ribossomo' },
    { subject: 'biologia', question: 'Como se chama a divisão celular que forma os gametas?', answer: 'meiose' },
    { subject: 'biologia', question: 'Como se chama a divisão celular que gera duas células iguais à original?', answer: 'mitose' },
    { subject: 'biologia', question: 'Que tecido da planta transporta a água e os sais minerais?', answer: 'xilema' },
    { subject: 'biologia', question: 'Que tecido da planta transporta a seiva elaborada?', answer: 'floema' },
    { subject: 'biologia', question: 'Qual enzima da saliva começa a digerir o amido?', answer: 'amilase' },
    { subject: 'biologia', question: 'Qual ciência estuda a relação dos seres vivos com o ambiente?', answer: 'ecologia' },
    { subject: 'quimica', question: 'Como se chama a ligação em que os átomos compartilham elétrons?', answer: 'covalente' },
    { subject: 'quimica', question: 'Como se chama a ligação entre íons de cargas opostas?', answer: 'iônica' },
    { subject: 'quimica', question: 'Qual gás nobre é usado para encher balões de festa?', answer: 'hélio' },
    { subject: 'quimica', question: 'Como se chama o ácido de fórmula HCl?', answer: 'clorídrico' },
    { subject: 'quimica', question: 'Como se chama a passagem direta do estado sólido para o gasoso?', answer: 'sublimação' },
    { subject: 'quimica', question: 'Que elemento tem o símbolo K?', answer: 'potássio' },
    { subject: 'quimica', question: 'Como se chama a mistura que tem um aspecto uniforme?', answer: 'homogênea' },
    { subject: 'quimica', question: 'Como se chama a reação que libera calor?', answer: 'exotérmica' },
  ],
};
