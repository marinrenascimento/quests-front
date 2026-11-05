import type { GameDifficulty, SpellingWord } from '@/constants/games';

// TODO: se as palavras passarem a vir do back (RN-298), substituir por elas. Hoje a lista fica só
// no app. Para acrescentar uma palavra, escreva à mão as 3 formas erradas: `shown` no meio da tela e
// as 2 de `wrong` nas opções. Nenhuma delas pode ser uma palavra que existe (ex.: "sessão" como erro
// de "seção"), nem repetir outra forma da mesma palavra. Uma palavra fica em um nível só.

/** Palavras do Goblin Ortográfico por nível (RN-301): erros comuns de escrita, em minúsculas */
export const MOCK_SPELLING_WORDS: Record<GameDifficulty, SpellingWord[]> = {
  // Palavras do dia a dia
  facil: [
    { correct: 'cachorro', shown: 'caxorro', wrong: ['cachoro', 'caxoro'] },
    { correct: 'bicicleta', shown: 'bisicreta', wrong: ['bicicreta', 'bissicleta'] },
    { correct: 'chuveiro', shown: 'xuveiro', wrong: ['chuvero', 'xuvero'] },
    { correct: 'mendigo', shown: 'mindigo', wrong: ['mendingo', 'mendígo'] },
    { correct: 'pesquisa', shown: 'pesqiza', wrong: ['pesquiza', 'pesqisa'] },
    { correct: 'vassoura', shown: 'vasoura', wrong: ['vaçoura', 'vasora'] },
    { correct: 'atrás', shown: 'atras', wrong: ['atraz', 'atráz'] },
    { correct: 'através', shown: 'atraves', wrong: ['atravez', 'atravéz'] },
    { correct: 'xícara', shown: 'chicara', wrong: ['chícara', 'xicara'] },
    { correct: 'losango', shown: 'losangu', wrong: ['lozango', 'lossango'] },
    { correct: 'companhia', shown: 'conpania', wrong: ['compania', 'companhía'] },
    { correct: 'advogado', shown: 'adivogadu', wrong: ['adivogado', 'adevogado'] },
    { correct: 'berinjela', shown: 'beringella', wrong: ['beringela', 'berinjéla'] },
    { correct: 'mortadela', shown: 'mortandella', wrong: ['mortandela', 'mortadella'] },
    { correct: 'enxergar', shown: 'inxergar', wrong: ['encherguar', 'enchergar'] },
  ],
  // Palavras com s, z, x e ç que confundem. O exemplo do grupo (exibição) vem primeiro.
  medio: [
    { correct: 'exibição', shown: 'essibissao', wrong: ['exibizão', 'ezibissão'] },
    { correct: 'análise', shown: 'analize', wrong: ['análize', 'ánalise'] },
    { correct: 'hesitar', shown: 'ezitar', wrong: ['exitar', 'hezitar'] },
    { correct: 'excursão', shown: 'escursao', wrong: ['escursão', 'excurção'] },
    { correct: 'extensão', shown: 'estensao', wrong: ['extenção', 'estensão'] },
    { correct: 'frustração', shown: 'frustacao', wrong: ['frustação', 'frustrassão'] },
    { correct: 'impecável', shown: 'inpecavel', wrong: ['inpecável', 'impecavel'] },
    { correct: 'asterisco', shown: 'asteristico', wrong: ['asterístico', 'astericso'] },
    { correct: 'bicarbonato', shown: 'bicarbunato', wrong: ['bicabornato', 'bicarbornato'] },
    { correct: 'cabeleireiro', shown: 'cabelerero', wrong: ['cabelereiro', 'cabeleleiro'] },
    { correct: 'privilégio', shown: 'previlejio', wrong: ['previlégio', 'privilejio'] },
    { correct: 'nascimento', shown: 'nacimento', wrong: ['nasimento', 'nassimento'] },
    { correct: 'piscina', shown: 'pissina', wrong: ['picina', 'pisina'] },
    { correct: 'cansaço', shown: 'cansasso', wrong: ['canssaço', 'cansaso'] },
    { correct: 'exercício', shown: 'ezersicio', wrong: ['exercísio', 'ecxercício'] },
  ],
  // Palavras longas ou pouco comuns
  dificil: [
    { correct: 'exceção', shown: 'ecessao', wrong: ['excessão', 'esceção'] },
    { correct: 'beneficente', shown: 'benefissente', wrong: ['beneficiente', 'benefisente'] },
    { correct: 'assessor', shown: 'asessor', wrong: ['assesor', 'acessor'] },
    { correct: 'obsessão', shown: 'obsecao', wrong: ['obcessão', 'obseção'] },
    { correct: 'ascensão', shown: 'acensao', wrong: ['acensão', 'assensão'] },
    { correct: 'prazeroso', shown: 'prasserozo', wrong: ['prazeiroso', 'prazerozo'] },
    { correct: 'rubrica', shown: 'rubica', wrong: ['rúbrica', 'rublica'] },
    { correct: 'meteorologia', shown: 'meterolojia', wrong: ['meteorolojia', 'meterologia'] },
    { correct: 'paralisação', shown: 'paralizassao', wrong: ['paralização', 'paralisassão'] },
    { correct: 'excesso', shown: 'ecesso', wrong: ['exceso', 'escesso'] },
    { correct: 'idiossincrasia', shown: 'idiosincrazia', wrong: ['idiossincrazia', 'idiosincrasia'] },
    { correct: 'suscetível', shown: 'sucetivel', wrong: ['sucetível', 'sussetível'] },
    { correct: 'discrepância', shown: 'descrepancia', wrong: ['descrepância', 'discrepança'] },
    { correct: 'ressarcir', shown: 'resarcir', wrong: ['ressarsir', 'ressarçir'] },
    { correct: 'espontâneo', shown: 'expontaneo', wrong: ['expontâneo', 'espontáneo'] },
  ],
};
