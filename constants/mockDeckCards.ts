import { Deck, DeckCard } from '@/constants/decks';

// TODO: substituir pelos dados do back. Cards fictícios, gerados a partir dos títulos abaixo.
// A quantidade de cada deck vem de deck.cardsCount (a mesma exibida em Meus Decks): a geração
// produz exatamente esse número, então a contagem e a lista nunca divergem.

/** Títulos base de cada deck (por id). Repetidos com número no final quando faltar título. */
const CARD_TITLES: Record<string, string[]> = {
  'substantivos-adjetivos': [
    'Substantivo próprio e comum',
    'Substantivo concreto e abstrato',
    'Substantivo coletivo',
    'Flexão de gênero',
    'Flexão de número',
    'Grau do substantivo',
    'Adjetivo pátrio',
    'Locução adjetiva',
    'Grau comparativo do adjetivo',
    'Grau superlativo do adjetivo',
  ],
  'sistema-nervoso': [
    'Neurônio e suas partes',
    'Sinapse química',
    'Sistema nervoso central',
    'Sistema nervoso periférico',
    'Encéfalo e medula espinhal',
    'Ato reflexo',
    'Sistema simpático',
    'Sistema parassimpático',
    'Neurotransmissores',
  ],
  'primeira-guerra': [
    'Assassinato de Francisco Ferdinando',
    'Tríplice Entente',
    'Tríplice Aliança',
    'Guerra de trincheiras',
    'Política de alianças',
    'Entrada dos EUA na guerra',
    'Saída da Rússia em 1917',
    'Tratado de Versalhes',
    'Liga das Nações',
  ],
  renascimento: [
    'Humanismo renascentista',
    'Perspectiva linear',
    'Leonardo da Vinci',
    'Michelangelo e a Capela Sistina',
    'Rafael Sanzio',
    'Mecenato em Florença',
    'Antropocentrismo',
    'O Nascimento de Vênus',
  ],
  'radiciacao-potenciacao': [
    'Potência de expoente zero',
    'Potência de expoente negativo',
    'Produto de potências de mesma base',
    'Potência de potência',
    'Raiz quadrada exata',
    'Simplificação de radicais',
    'Racionalização de denominadores',
    'Expoente fracionário',
  ],
  'guerra-fria': [
    'Doutrina Truman',
    'Plano Marshall',
    'OTAN e Pacto de Varsóvia',
    'Muro de Berlim',
    'Corrida espacial',
    'Crise dos Mísseis em Cuba',
    'Guerra da Coreia',
    'Guerra do Vietnã',
    'Fim da União Soviética',
  ],
  'funcoes-primeiro-grau': [
    'Definição de função afim',
    'Coeficiente angular',
    'Coeficiente linear',
    'Raiz da função afim',
    'Gráfico da função afim',
    'Função crescente e decrescente',
    'Estudo do sinal',
    'Função linear e identidade',
  ],
  'tabela-periodica': [
    'Famílias e períodos',
    'Metais alcalinos',
    'Halogênios',
    'Gases nobres',
    'Raio atômico',
    'Eletronegatividade',
    'Energia de ionização',
    'Metais de transição',
  ],
  'leis-de-newton': [
    'Primeira lei: inércia',
    'Segunda lei: força e aceleração',
    'Terceira lei: ação e reação',
    'Força peso',
    'Força normal',
    'Força de atrito',
    'Plano inclinado',
    'Tração em fios',
  ],
  'brasil-colonia': [
    'Capitanias hereditárias',
    'Governo-geral',
    'Ciclo do pau-brasil',
    'Ciclo do açúcar',
    'Ciclo do ouro',
    'Bandeirantes',
    'Inconfidência Mineira',
    'Conjuração Baiana',
    'Missões jesuíticas',
  ],
  ecologia: [
    'Cadeia alimentar',
    'Teia alimentar',
    'Níveis tróficos',
    'Ciclo do carbono',
    'Ciclo do nitrogênio',
    'Mutualismo',
    'Predatismo',
    'Sucessão ecológica',
  ],
  modernismo: [
    'Semana de Arte Moderna de 1922',
    'Manifesto Antropófago',
    'Primeira fase modernista',
    'Geração de 30',
    'Geração de 45',
    'Macunaíma',
    'Oswald de Andrade',
    'Carlos Drummond de Andrade',
  ],
  'geometria-plana': [
    'Área do triângulo',
    'Área do círculo',
    'Perímetro de polígonos',
    'Teorema de Pitágoras',
    'Semelhança de triângulos',
    'Soma dos ângulos internos',
    'Teorema de Tales',
    'Quadriláteros notáveis',
  ],
  'revolucao-industrial': [
    'Pioneirismo inglês',
    'Máquina a vapor',
    'Cercamentos',
    'Ludismo',
    'Cartismo',
    'Segunda Revolução Industrial',
    'Fordismo',
    'Condições dos operários',
  ],
  'verb-tenses': [
    'Simple present',
    'Present continuous',
    'Simple past',
    'Past continuous',
    'Present perfect',
    'Future with will',
    'Future with going to',
    'Past perfect',
  ],
};

// Cada deck é gerado uma vez só (decks grandes, como o de 1.250 cards, não são refeitos)
const cache = new Map<string, DeckCard[]>();

/**
 * Cards fictícios de um deck, determinísticos (ids estáveis, sem aleatoriedade): exatamente
 * deck.cardsCount cards. Quando a quantidade passa da lista de títulos, a lista se repete com
 * um número no final ("Tríplice Entente 2", "Tríplice Entente 3"...).
 */
export function getMockDeckCards(deck: Deck): DeckCard[] {
  const cached = cache.get(deck.id);
  if (cached) {
    return cached;
  }

  const titles = CARD_TITLES[deck.id] ?? [];
  const cards: DeckCard[] =
    titles.length === 0
      ? []
      : Array.from({ length: deck.cardsCount }, (_, index) => {
          const round = Math.floor(index / titles.length);
          const base = titles[index % titles.length];
          return {
            id: `${deck.id}-${index + 1}`,
            deckId: deck.id,
            title: round === 0 ? base : `${base} ${round + 1}`,
          };
        });

  cache.set(deck.id, cards);
  return cards;
}
