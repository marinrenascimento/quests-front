import { Deck, DeckCard } from '@/constants/decks';
import { slugify } from '@/utils/normalizeSearch';

// TODO: substituir pelos dados do back. Cards fictícios, gerados a partir dos cards-base abaixo.
// A quantidade de cada deck vem de deck.cardsCount (a mesma exibida em Meus Decks): a geração
// produz exatamente esse número, então a contagem e a lista nunca divergem.

/**
 * Título (mostrado na lista de cards) e frente/verso (mostrados na revisão) de um card-base. A
 * disciplina e o conteúdo vêm do deck.
 */
type CardBase = Pick<DeckCard, 'title' | 'front' | 'back'>;

/**
 * Cards-base de cada deck (por id), na ordem da lista. Repetidos com número no final do título
 * quando faltar card; as repetições usam a mesma frente e o mesmo verso do original.
 */
const CARD_BASES: Record<string, CardBase[]> = {
  'substantivos-adjetivos': [
    {
      title: 'Substantivo próprio e comum',
      front: 'Qual a diferença entre substantivo próprio e comum?',
      back: 'O próprio nomeia um ser específico e começa com maiúscula (Maria, Brasil). O comum nomeia qualquer ser da espécie (menina, país).',
    },
    {
      title: 'Substantivo concreto e abstrato',
      front: 'Como diferenciar substantivo concreto de abstrato?',
      back: 'O concreto nomeia seres com existência própria, reais ou imaginários (mesa, fada). O abstrato nomeia sentimentos, ações e estados (amor, corrida).',
    },
    {
      title: 'Substantivo coletivo',
      front: 'O que é um substantivo coletivo?',
      back: 'É o que, mesmo no singular, indica um conjunto de seres da mesma espécie, como cardume (peixes), alcateia (lobos) e arquipélago (ilhas).',
    },
    {
      title: 'Flexão de gênero',
      front: 'Como o substantivo varia em gênero?',
      back: 'Entre masculino e feminino: pela troca da terminação (menino/menina), por palavras diferentes (boi/vaca) ou só pelo artigo (o/a estudante).',
    },
    {
      title: 'Flexão de número',
      front: 'Como se forma o plural das palavras terminadas em -ão?',
      back: 'De três formas: -ões (balão/balões), -ães (pão/pães) e -ãos (mão/mãos). Algumas aceitam mais de uma, como aldeões e aldeãos.',
    },
    {
      title: 'Grau do substantivo',
      front: 'Quais são os graus do substantivo?',
      back: 'Aumentativo e diminutivo, formados por sufixos (casarão, casinha) ou por adjetivos que indicam tamanho (casa grande, casa pequena).',
    },
    {
      title: 'Adjetivo pátrio',
      front: 'O que é um adjetivo pátrio?',
      back: 'É o que indica a origem ou a nacionalidade de alguém ou de algo: brasileiro, paulista, carioca, soteropolitano.',
    },
    {
      title: 'Locução adjetiva',
      front: 'O que é uma locução adjetiva?',
      back: 'Uma expressão com valor de adjetivo, geralmente preposição + substantivo: amor de mãe (materno), luz do sol (solar).',
    },
    {
      title: 'Grau comparativo do adjetivo',
      front: 'Quais são os tipos de grau comparativo do adjetivo?',
      back: 'De superioridade (mais alto que), de igualdade (tão alto quanto) e de inferioridade (menos alto que).',
    },
    {
      title: 'Grau superlativo do adjetivo',
      front: 'Qual a diferença entre superlativo absoluto e relativo?',
      back: 'O absoluto intensifica a qualidade sozinho (muito belo, belíssimo). O relativo destaca o ser dentro de um grupo (o mais belo da turma).',
    },
  ],
  'sistema-nervoso': [
    {
      title: 'Neurônio e suas partes',
      front: 'Quais são as partes principais de um neurônio?',
      back: 'Dendritos, que recebem os estímulos; corpo celular, onde fica o núcleo; e axônio, que conduz o impulso nervoso até a próxima célula.',
    },
    {
      title: 'Sinapse química',
      front: 'Como funciona uma sinapse química?',
      back: 'O impulso chega ao fim do axônio e libera neurotransmissores na fenda sináptica. Eles se ligam a receptores da célula seguinte e transmitem o sinal.',
    },
    {
      title: 'Sistema nervoso central',
      front: 'Que órgãos formam o sistema nervoso central?',
      back: 'O encéfalo e a medula espinhal, protegidos pelo crânio, pela coluna vertebral e pelas meninges.',
    },
    {
      title: 'Sistema nervoso periférico',
      front: 'O que compõe o sistema nervoso periférico?',
      back: 'Os nervos e gânglios espalhados pelo corpo, que levam informações ao sistema nervoso central e trazem dele as respostas.',
    },
    {
      title: 'Encéfalo e medula espinhal',
      front: 'Quais são as partes do encéfalo?',
      back: 'Cérebro, cerebelo e tronco encefálico. Abaixo dele, a medula espinhal percorre a coluna vertebral e liga o encéfalo ao resto do corpo.',
    },
    {
      title: 'Ato reflexo',
      front: 'O que é um ato reflexo?',
      back: 'Uma resposta rápida e involuntária a um estímulo, coordenada pela medula espinhal, como tirar a mão de algo quente antes de sentir dor.',
    },
    {
      title: 'Sistema simpático',
      front: 'Qual é o papel do sistema nervoso simpático?',
      back: 'Preparar o corpo para situações de estresse ou perigo: acelera o coração, dilata as pupilas e aumenta a respiração.',
    },
    {
      title: 'Sistema parassimpático',
      front: 'Qual é o papel do sistema nervoso parassimpático?',
      back: 'Atuar no repouso: desacelera o coração, contrai as pupilas e estimula a digestão, devolvendo o corpo ao equilíbrio.',
    },
    {
      title: 'Neurotransmissores',
      front: 'Cite exemplos de neurotransmissores e suas funções.',
      back: 'Dopamina (prazer e motivação), serotonina (humor e sono), acetilcolina (contração muscular) e noradrenalina (estado de alerta).',
    },
  ],
  'primeira-guerra': [
    {
      title: 'Causas da guerra',
      front: 'Quais foram as principais causas?',
      back: 'As principais causas da Primeira Guerra Mundial (1914-1918) foram um conjunto de tensões profundas na Europa.',
    },
    {
      title: 'Tríplice Entente',
      front: 'Quais países formavam a Tríplice Entente?',
      back: 'Reino Unido, França e Império Russo. Os Estados Unidos entraram na guerra ao lado deles em 1917.',
    },
    {
      title: 'Tríplice Aliança',
      front: 'Quais países formavam a Tríplice Aliança?',
      back: 'Alemanha, Império Austro-Húngaro e Itália. A Itália mudou de lado em 1915 e lutou junto à Entente.',
    },
    {
      title: 'Guerra de trincheiras',
      front: 'Como era a guerra de trincheiras?',
      back: 'Os exércitos se protegiam em valas cavadas no chão, separadas por uma “terra de ninguém”. O avanço era lento e as condições, terríveis.',
    },
    {
      title: 'Política de alianças',
      front: 'Por que a política de alianças ampliou o conflito?',
      back: 'Os acordos de defesa mútua fizeram um conflito regional arrastar várias potências: quando um país entrava na guerra, seus aliados o seguiam.',
    },
    {
      title: 'Entrada dos EUA na guerra',
      front: 'Por que os Estados Unidos entraram na guerra em 1917?',
      back: 'Pelos ataques de submarinos alemães a navios americanos e pelo Telegrama Zimmermann, em que a Alemanha propunha uma aliança ao México.',
    },
    {
      title: 'Saída da Rússia em 1917',
      front: 'Por que a Rússia saiu da guerra?',
      back: 'Após a Revolução de 1917, os bolcheviques assinaram com a Alemanha o Tratado de Brest-Litovsk (1918), cedendo territórios.',
    },
    {
      title: 'Tratado de Versalhes',
      front: 'O que determinou o Tratado de Versalhes?',
      back: 'Assinado em 1919, culpou a Alemanha pela guerra e impôs perda de territórios, redução do exército e pesadas indenizações.',
    },
    {
      title: 'Liga das Nações',
      front: 'Qual era o objetivo da Liga das Nações?',
      back: 'Criada em 1919, buscava manter a paz mundial e resolver conflitos pelo diálogo. Fracassou e não conseguiu evitar a Segunda Guerra.',
    },
  ],
  renascimento: [
    {
      title: 'Humanismo renascentista',
      front: 'O que defendia o humanismo renascentista?',
      back: 'A valorização do ser humano, da razão e do saber, inspirada na cultura greco-romana, em contraste com a visão medieval centrada em Deus.',
    },
    {
      title: 'Perspectiva linear',
      front: 'O que a perspectiva linear trouxe para a pintura?',
      back: 'A ilusão de profundidade numa superfície plana, com linhas que convergem para um ponto de fuga. Brunelleschi foi um de seus pioneiros.',
    },
    {
      title: 'Leonardo da Vinci',
      front: 'Quais são as obras mais famosas de Leonardo da Vinci?',
      back: 'A Mona Lisa e A Última Ceia. Ele também se destacou como inventor, anatomista e engenheiro.',
    },
    {
      title: 'Michelangelo e a Capela Sistina',
      front: 'O que Michelangelo pintou na Capela Sistina?',
      back: 'O teto, com cenas do Gênesis como A Criação de Adão, e a parede do altar, com O Juízo Final.',
    },
    {
      title: 'Rafael Sanzio',
      front: 'Qual é a obra mais conhecida de Rafael Sanzio?',
      back: 'A Escola de Atenas, afresco no Vaticano que reúne filósofos gregos como Platão e Aristóteles numa composição equilibrada.',
    },
    {
      title: 'Mecenato em Florença',
      front: 'O que era o mecenato?',
      back: 'O patrocínio de artistas e intelectuais por famílias ricas, como os Médici em Florença, que financiavam obras em troca de prestígio.',
    },
    {
      title: 'Antropocentrismo',
      front: 'O que significa antropocentrismo?',
      back: 'A ideia de que o ser humano está no centro do universo e das preocupações, no lugar do teocentrismo medieval.',
    },
    {
      title: 'O Nascimento de Vênus',
      front: 'Quem pintou O Nascimento de Vênus?',
      back: 'Sandro Botticelli, por volta de 1485. A obra mostra a deusa saindo do mar sobre uma concha, um tema da mitologia clássica.',
    },
  ],
  'radiciacao-potenciacao': [
    {
      title: 'Potência de expoente zero',
      front: 'Quanto vale um número não nulo elevado a zero?',
      back: 'Vale 1. Por exemplo, 5^0 = 1 e (−3)^0 = 1. Já 0^0 é uma indeterminação.',
    },
    {
      title: 'Potência de expoente negativo',
      front: 'Como calcular uma potência de expoente negativo?',
      back: 'Inverte-se a base e troca-se o sinal do expoente. Por exemplo, 2^(−3) = 1/2^3 = 1/8.',
    },
    {
      title: 'Produto de potências de mesma base',
      front: 'Como multiplicar potências de mesma base?',
      back: 'Conserva-se a base e somam-se os expoentes: a^m · a^n = a^(m+n). Exemplo: 3^2 · 3^4 = 3^6.',
    },
    {
      title: 'Potência de potência',
      front: 'Como resolver uma potência de potência?',
      back: 'Conserva-se a base e multiplicam-se os expoentes: (a^m)^n = a^(m·n). Exemplo: (2^3)^2 = 2^6 = 64.',
    },
    {
      title: 'Raiz quadrada exata',
      front: 'O que é uma raiz quadrada exata?',
      back: 'É a raiz de um quadrado perfeito, que resulta em número inteiro: √49 = 7, porque 7 · 7 = 49.',
    },
    {
      title: 'Simplificação de radicais',
      front: 'Como simplificar √72?',
      back: 'Decompõe-se 72 em 36 · 2 e extrai-se a raiz do quadrado perfeito: √72 = √36 · √2 = 6√2.',
    },
    {
      title: 'Racionalização de denominadores',
      front: 'Como racionalizar a fração 1/√2?',
      back: 'Multiplicam-se o numerador e o denominador por √2, eliminando a raiz de baixo: 1/√2 = √2/2.',
    },
    {
      title: 'Expoente fracionário',
      front: 'Como escrever uma potência de expoente fracionário como raiz?',
      back: 'O denominador vira o índice da raiz e o numerador, o expoente. Exemplo: 8^(2/3) é a raiz cúbica de 8^2 = 64, ou seja, 4.',
    },
  ],
  'guerra-fria': [
    {
      title: 'Doutrina Truman',
      front: 'O que foi a Doutrina Truman?',
      back: 'Política anunciada pelos EUA em 1947 para conter a expansão do comunismo, apoiando países ameaçados pela influência soviética.',
    },
    {
      title: 'Plano Marshall',
      front: 'Qual era o objetivo do Plano Marshall?',
      back: 'Dar ajuda econômica americana para reconstruir a Europa Ocidental após a Segunda Guerra e afastar a região da influência soviética.',
    },
    {
      title: 'OTAN e Pacto de Varsóvia',
      front: 'O que eram a OTAN e o Pacto de Varsóvia?',
      back: 'Alianças militares rivais: a OTAN (1949) reunia os EUA e aliados ocidentais; o Pacto de Varsóvia (1955), a URSS e o Leste Europeu.',
    },
    {
      title: 'Muro de Berlim',
      front: 'Por que o Muro de Berlim foi construído?',
      back: 'Foi erguido em 1961 pela Alemanha Oriental para impedir fugas para Berlim Ocidental. Sua queda, em 1989, simbolizou o fim da Guerra Fria.',
    },
    {
      title: 'Corrida espacial',
      front: 'Quais foram os marcos da corrida espacial?',
      back: 'A URSS lançou o Sputnik (1957) e levou Yuri Gagarin ao espaço (1961). Os EUA levaram o primeiro homem à Lua, em 1969.',
    },
    {
      title: 'Crise dos Mísseis em Cuba',
      front: 'O que provocou a Crise dos Mísseis em 1962?',
      back: 'A instalação de mísseis soviéticos em Cuba, perto dos EUA. Após 13 dias de tensão, a URSS os retirou em troca de concessões americanas.',
    },
    {
      title: 'Guerra da Coreia',
      front: 'Como terminou a Guerra da Coreia?',
      back: 'Com um armistício em 1953, sem tratado de paz. A península continuou dividida perto do paralelo 38, entre Norte e Sul.',
    },
    {
      title: 'Guerra do Vietnã',
      front: 'Qual foi o resultado da Guerra do Vietnã?',
      back: 'A derrota dos EUA e do Vietnã do Sul. Em 1975, o país foi unificado sob o governo comunista do Norte.',
    },
    {
      title: 'Fim da União Soviética',
      front: 'Quando e como a União Soviética chegou ao fim?',
      back: 'Em dezembro de 1991, após crises econômicas e as reformas de Gorbachev, as repúblicas soviéticas se tornaram independentes.',
    },
  ],
  'funcoes-primeiro-grau': [
    {
      title: 'Definição de função afim',
      front: 'Qual é a forma geral de uma função afim?',
      back: 'f(x) = ax + b, com a e b reais e a ≠ 0. O gráfico é sempre uma reta.',
    },
    {
      title: 'Coeficiente angular',
      front: 'O que o coeficiente angular indica?',
      back: 'É o valor a em f(x) = ax + b: mostra a inclinação da reta, ou quanto y varia quando x aumenta uma unidade.',
    },
    {
      title: 'Coeficiente linear',
      front: 'O que o coeficiente linear representa no gráfico?',
      back: 'É o valor b em f(x) = ax + b: o ponto em que a reta corta o eixo y, ou seja, o valor de f(0).',
    },
    {
      title: 'Raiz da função afim',
      front: 'Como encontrar a raiz de f(x) = 2x − 6?',
      back: 'Iguala-se a função a zero: 2x − 6 = 0, logo x = 3. É o ponto em que a reta corta o eixo x.',
    },
    {
      title: 'Gráfico da função afim',
      front: 'Quantos pontos bastam para traçar o gráfico de uma função afim?',
      back: 'Dois, porque o gráfico é uma reta. Costuma-se usar a raiz e o ponto em que a reta corta o eixo y.',
    },
    {
      title: 'Função crescente e decrescente',
      front: 'Quando uma função afim é crescente ou decrescente?',
      back: 'É crescente quando a > 0 (a reta sobe) e decrescente quando a < 0 (a reta desce).',
    },
    {
      title: 'Estudo do sinal',
      front: 'Qual é o sinal de f(x) = x − 4 para x > 4?',
      back: 'Positivo. Como a > 0, a função é crescente e fica acima do eixo x depois da raiz, que é 4.',
    },
    {
      title: 'Função linear e identidade',
      front: 'Qual a diferença entre função linear e função identidade?',
      back: 'A linear tem b = 0, f(x) = ax, e passa pela origem. A identidade é o caso em que a = 1: f(x) = x.',
    },
  ],
  'tabela-periodica': [
    {
      title: 'Famílias e períodos',
      front: 'O que são famílias e períodos na tabela periódica?',
      back: 'Famílias (ou grupos) são as 18 colunas, com propriedades parecidas. Períodos são as 7 linhas e indicam o número de camadas eletrônicas.',
    },
    {
      title: 'Metais alcalinos',
      front: 'Quais são as características dos metais alcalinos?',
      back: 'Formam a família 1 (lítio, sódio, potássio...). Têm 1 elétron na última camada e são muito reativos, principalmente com água.',
    },
    {
      title: 'Halogênios',
      front: 'Quais elementos formam a família dos halogênios?',
      back: 'Flúor, cloro, bromo, iodo e astato, na família 17. Têm 7 elétrons na última camada e tendem a ganhar 1 elétron.',
    },
    {
      title: 'Gases nobres',
      front: 'Por que os gases nobres quase não reagem?',
      back: 'Têm a camada de valência completa (8 elétrons, ou 2 no hélio), o que os torna muito estáveis.',
    },
    {
      title: 'Raio atômico',
      front: 'Como o raio atômico varia na tabela periódica?',
      back: 'Aumenta de cima para baixo nas famílias (mais camadas) e da direita para a esquerda nos períodos.',
    },
    {
      title: 'Eletronegatividade',
      front: 'Qual é o elemento mais eletronegativo?',
      back: 'O flúor. A eletronegatividade cresce de baixo para cima e da esquerda para a direita, sem contar os gases nobres.',
    },
    {
      title: 'Energia de ionização',
      front: 'O que é energia de ionização?',
      back: 'A energia necessária para retirar um elétron de um átomo isolado no estado gasoso. Ela cresce no sentido contrário ao raio atômico.',
    },
    {
      title: 'Metais de transição',
      front: 'Onde ficam os metais de transição na tabela?',
      back: 'No bloco central, das famílias 3 a 12. Exemplos: ferro, cobre, prata e ouro.',
    },
  ],
  'leis-de-newton': [
    {
      title: 'Primeira lei: inércia',
      front: 'O que diz a primeira lei de Newton?',
      back: 'Um corpo permanece em repouso ou em movimento retilíneo uniforme até que uma força resultante atue sobre ele.',
    },
    {
      title: 'Segunda lei: força e aceleração',
      front: 'Qual é a fórmula da segunda lei de Newton?',
      back: 'F = m · a: a força resultante é a massa vezes a aceleração. Quanto maior a massa, maior a força necessária para acelerar o corpo.',
    },
    {
      title: 'Terceira lei: ação e reação',
      front: 'O que afirma o princípio da ação e reação?',
      back: 'Toda ação gera uma reação de mesma intensidade e direção, mas de sentido oposto, aplicada em outro corpo.',
    },
    {
      title: 'Força peso',
      front: 'Como calcular a força peso?',
      back: 'P = m · g, em que m é a massa e g, a aceleração da gravidade (cerca de 10 m/s² na Terra).',
    },
    {
      title: 'Força normal',
      front: 'O que é a força normal?',
      back: 'A força que uma superfície exerce sobre um corpo apoiado nela, sempre perpendicular à superfície de contato.',
    },
    {
      title: 'Força de atrito',
      front: 'De que depende a força de atrito?',
      back: 'Do coeficiente de atrito entre as superfícies e da força normal: Fat = μ · N. Ela se opõe ao movimento ou à tendência dele.',
    },
    {
      title: 'Plano inclinado',
      front: 'Como o peso se decompõe em um plano inclinado?',
      back: 'Em P · sen θ, paralela ao plano, que puxa o corpo para baixo, e P · cos θ, perpendicular a ele, equilibrada pela normal.',
    },
    {
      title: 'Tração em fios',
      front: 'O que é a força de tração?',
      back: 'A força transmitida por um fio ou corda esticada. Em fios ideais, ela tem o mesmo valor nas duas pontas.',
    },
  ],
  'brasil-colonia': [
    {
      title: 'Capitanias hereditárias',
      front: 'O que foram as capitanias hereditárias?',
      back: 'Faixas de terra doadas pela Coroa portuguesa a donatários a partir de 1534, que deviam povoá-las e explorá-las por conta própria.',
    },
    {
      title: 'Governo-geral',
      front: 'Por que foi criado o governo-geral?',
      back: 'Pelo fracasso da maioria das capitanias. Em 1549, Tomé de Sousa chegou como primeiro governador-geral e fundou Salvador.',
    },
    {
      title: 'Ciclo do pau-brasil',
      front: 'Como era explorado o pau-brasil?',
      back: 'Pelo escambo com os indígenas, que cortavam e transportavam a madeira em troca de objetos. Dela se extraía um corante vermelho.',
    },
    {
      title: 'Ciclo do açúcar',
      front: 'Onde se concentrou a produção de açúcar na colônia?',
      back: 'No litoral do Nordeste, principalmente em Pernambuco e na Bahia, em grandes engenhos movidos pelo trabalho de pessoas escravizadas.',
    },
    {
      title: 'Ciclo do ouro',
      front: 'Quais mudanças o ciclo do ouro trouxe à colônia?',
      back: 'Deslocou o eixo econômico para Minas Gerais, fez crescer as cidades e levou a capital de Salvador para o Rio de Janeiro, em 1763.',
    },
    {
      title: 'Bandeirantes',
      front: 'Quem eram os bandeirantes?',
      back: 'Exploradores, em geral paulistas, que adentravam o interior em busca de metais preciosos e de indígenas para escravizar.',
    },
    {
      title: 'Inconfidência Mineira',
      front: 'O que motivou a Inconfidência Mineira?',
      back: 'A revolta contra os altos impostos sobre o ouro e a ameaça da derrama. O movimento foi descoberto em 1789 e Tiradentes, executado.',
    },
    {
      title: 'Conjuração Baiana',
      front: 'Quais eram as propostas da Conjuração Baiana?',
      back: 'Em 1798, defendia a independência, a república e o fim da escravidão. Teve grande participação de pessoas pobres, negras e mestiças.',
    },
    {
      title: 'Missões jesuíticas',
      front: 'O que eram as missões jesuíticas?',
      back: 'Aldeamentos organizados por padres jesuítas para catequizar os indígenas, que viviam e trabalhavam sob a direção religiosa.',
    },
  ],
  ecologia: [
    {
      title: 'Cadeia alimentar',
      front: 'O que representa uma cadeia alimentar?',
      back: 'A sequência em que a energia passa de um ser vivo para outro pela alimentação: produtores, consumidores e decompositores.',
    },
    {
      title: 'Teia alimentar',
      front: 'Qual a diferença entre cadeia e teia alimentar?',
      back: 'A cadeia é uma sequência linear. A teia reúne várias cadeias interligadas: um ser pode comer e ser comido por vários outros.',
    },
    {
      title: 'Níveis tróficos',
      front: 'Quais são os níveis tróficos?',
      back: 'Produtores e consumidores primários, secundários e terciários. A cada nível, cerca de 90% da energia se perde, principalmente como calor.',
    },
    {
      title: 'Ciclo do carbono',
      front: 'Como o carbono circula entre os seres vivos e o ambiente?',
      back: 'A fotossíntese retira gás carbônico do ar e forma matéria orgânica; a respiração, a decomposição e as queimadas o devolvem à atmosfera.',
    },
    {
      title: 'Ciclo do nitrogênio',
      front: 'Qual é o papel das bactérias no ciclo do nitrogênio?',
      back: 'Algumas fixam o nitrogênio do ar no solo, em compostos que as plantas absorvem. Outras devolvem o nitrogênio à atmosfera.',
    },
    {
      title: 'Mutualismo',
      front: 'O que é mutualismo?',
      back: 'Uma relação entre espécies diferentes em que as duas se beneficiam e dependem uma da outra, como fungos e algas nos liquens.',
    },
    {
      title: 'Predatismo',
      front: 'Como o predatismo ajuda a equilibrar um ecossistema?',
      back: 'Ao se alimentar das presas, o predador controla o tamanho das populações delas e evita que esgotem os recursos do ambiente.',
    },
    {
      title: 'Sucessão ecológica',
      front: 'O que é sucessão ecológica?',
      back: 'A mudança gradual das comunidades de um local ao longo do tempo, das espécies pioneiras até uma comunidade estável, chamada clímax.',
    },
  ],
  modernismo: [
    {
      title: 'Semana de Arte Moderna de 1922',
      front: 'O que foi a Semana de Arte Moderna de 1922?',
      back: 'Evento no Theatro Municipal de São Paulo que reuniu artistas contra a arte acadêmica e marcou o início do Modernismo no Brasil.',
    },
    {
      title: 'Manifesto Antropófago',
      front: 'Qual era a proposta do Manifesto Antropófago?',
      back: 'Publicado por Oswald de Andrade em 1928, propunha “devorar” a cultura estrangeira e transformá-la em algo genuinamente brasileiro.',
    },
    {
      title: 'Primeira fase modernista',
      front: 'Quais eram as marcas da primeira fase modernista?',
      back: 'Ruptura com a tradição, verso livre, linguagem coloquial, humor e valorização da identidade nacional.',
    },
    {
      title: 'Geração de 30',
      front: 'Qual foi o destaque da prosa da Geração de 30?',
      back: 'O romance regionalista e social, que denunciava a seca e a miséria do Nordeste, como em Vidas Secas, de Graciliano Ramos.',
    },
    {
      title: 'Geração de 45',
      front: 'O que caracteriza a Geração de 45?',
      back: 'A volta ao rigor formal na poesia. Na prosa, destacaram-se Guimarães Rosa e Clarice Lispector, com inovações na linguagem.',
    },
    {
      title: 'Macunaíma',
      front: 'Quem escreveu Macunaíma e quem é o protagonista?',
      back: 'Mário de Andrade, em 1928. O protagonista é o “herói sem nenhum caráter”, que mistura traços de diversas culturas brasileiras.',
    },
    {
      title: 'Oswald de Andrade',
      front: 'Quais são as obras mais conhecidas de Oswald de Andrade?',
      back: 'O Manifesto da Poesia Pau-Brasil, o Manifesto Antropófago e o romance Memórias Sentimentais de João Miramar.',
    },
    {
      title: 'Carlos Drummond de Andrade',
      front: 'Quais temas marcam a poesia de Drummond?',
      back: 'O cotidiano, a reflexão sobre o indivíduo e o mundo, a memória de Itabira e a crítica social, com ironia e linguagem simples.',
    },
  ],
  'geometria-plana': [
    {
      title: 'Área do triângulo',
      front: 'Qual é a fórmula da área do triângulo?',
      back: 'A = (b · h) / 2: a metade do produto da base pela altura relativa a ela.',
    },
    {
      title: 'Área do círculo',
      front: 'Como calcular a área de um círculo?',
      back: 'A = π · r², em que r é o raio. Para um raio de 3 cm, a área é 9π cm², cerca de 28,3 cm².',
    },
    {
      title: 'Perímetro de polígonos',
      front: 'O que é o perímetro de um polígono?',
      back: 'A soma das medidas de todos os lados. Um quadrado de lado 5 cm, por exemplo, tem 20 cm de perímetro.',
    },
    {
      title: 'Teorema de Pitágoras',
      front: 'O que diz o Teorema de Pitágoras?',
      back: 'Num triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos: a² = b² + c².',
    },
    {
      title: 'Semelhança de triângulos',
      front: 'Quando dois triângulos são semelhantes?',
      back: 'Quando têm os ângulos correspondentes iguais e os lados correspondentes proporcionais.',
    },
    {
      title: 'Soma dos ângulos internos',
      front: 'Quanto vale a soma dos ângulos internos de um polígono?',
      back: 'S = (n − 2) · 180°, em que n é o número de lados. No triângulo, 180°; no quadrilátero, 360°.',
    },
    {
      title: 'Teorema de Tales',
      front: 'O que afirma o Teorema de Tales?',
      back: 'Um feixe de retas paralelas cortado por duas transversais determina nelas segmentos proporcionais.',
    },
    {
      title: 'Quadriláteros notáveis',
      front: 'Quais são os quadriláteros notáveis?',
      back: 'Trapézio, paralelogramo, retângulo, losango e quadrado. O quadrado é, ao mesmo tempo, retângulo e losango.',
    },
  ],
  'revolucao-industrial': [
    {
      title: 'Pioneirismo inglês',
      front: 'Por que a Revolução Industrial começou na Inglaterra?',
      back: 'Pelo capital acumulado no comércio, pelas reservas de carvão e ferro, pela mão de obra vinda do campo e por um governo favorável à burguesia.',
    },
    {
      title: 'Máquina a vapor',
      front: 'Qual foi a importância da máquina a vapor?',
      back: 'Aperfeiçoada por James Watt, substituiu a força humana e animal e passou a mover fábricas, trens e navios.',
    },
    {
      title: 'Cercamentos',
      front: 'O que foram os cercamentos?',
      back: 'O fechamento das terras comunais na Inglaterra, que expulsou camponeses para as cidades, onde viraram mão de obra das fábricas.',
    },
    {
      title: 'Ludismo',
      front: 'O que faziam os ludistas?',
      back: 'Operários que, no início do século XIX, destruíam máquinas, vistas como culpadas pelo desemprego e pelos baixos salários.',
    },
    {
      title: 'Cartismo',
      front: 'Quais eram as reivindicações do cartismo?',
      back: 'Direitos políticos para os trabalhadores, como o voto para todos os homens e o voto secreto, reunidos na Carta do Povo (1838).',
    },
    {
      title: 'Segunda Revolução Industrial',
      front: 'Quais inovações marcaram a Segunda Revolução Industrial?',
      back: 'A eletricidade, o petróleo, o aço e o motor a combustão, a partir da segunda metade do século XIX.',
    },
    {
      title: 'Fordismo',
      front: 'O que caracteriza o fordismo?',
      back: 'A produção em massa com linha de montagem, criada por Henry Ford: cada operário repete uma única tarefa, o que reduz custos.',
    },
    {
      title: 'Condições dos operários',
      front: 'Como eram as condições de trabalho nas primeiras fábricas?',
      back: 'Jornadas de até 16 horas, salários baixos, ambientes insalubres e trabalho infantil, sem direitos trabalhistas.',
    },
  ],
  'verb-tenses': [
    {
      title: 'Simple present',
      front: 'Quando se usa o simple present?',
      back: 'Para hábitos, rotinas e verdades gerais. Na terceira pessoa do singular, o verbo recebe -s: She works every day.',
    },
    {
      title: 'Present continuous',
      front: 'Como se forma o present continuous?',
      back: 'Com am/is/are + verbo terminado em -ing. Indica ações que estão acontecendo agora: They are studying.',
    },
    {
      title: 'Simple past',
      front: 'Como fica um verbo regular no simple past?',
      back: 'Recebe -ed no final: work vira worked. Os irregulares têm formas próprias, como go/went.',
    },
    {
      title: 'Past continuous',
      front: 'Para que serve o past continuous?',
      back: 'Para ações em andamento num momento do passado, muitas vezes interrompidas: I was reading when you called.',
    },
    {
      title: 'Present perfect',
      front: 'Como se forma o present perfect?',
      back: 'Com have/has + particípio passado. Liga o passado ao presente: I have lived here for ten years.',
    },
    {
      title: 'Future with will',
      front: 'Quando usar will para falar do futuro?',
      back: 'Para decisões tomadas na hora, previsões e promessas: I will help you.',
    },
    {
      title: 'Future with going to',
      front: 'Quando usar going to para falar do futuro?',
      back: 'Para planos já decididos e previsões baseadas em evidências: It is going to rain.',
    },
    {
      title: 'Past perfect',
      front: 'O que indica o past perfect?',
      back: 'Uma ação passada concluída antes de outra também passada. Forma-se com had + particípio: She had left when I arrived.',
    },
  ],
};

// Cada deck é gerado uma vez só (decks grandes, como o de 1.250 cards, não são refeitos)
const cache = new Map<string, DeckCard[]>();

/**
 * Cards fictícios de um deck, determinísticos (ids estáveis, sem aleatoriedade): exatamente
 * deck.cardsCount cards. Quando a quantidade passa da lista de cards-base, a lista se repete com
 * um número no final do título ("Tríplice Entente 2", "Tríplice Entente 3"...), mantendo a
 * frente e o verso do card original.
 */
export function getMockDeckCards(deck: Deck): DeckCard[] {
  const cached = cache.get(deck.id);
  if (cached) {
    return cached;
  }

  const bases = CARD_BASES[deck.id] ?? [];
  const cards: DeckCard[] =
    bases.length === 0
      ? []
      : Array.from({ length: deck.cardsCount }, (_, index) => {
          const round = Math.floor(index / bases.length);
          const base = bases[index % bases.length];
          return {
            id: `${deck.id}-${index + 1}`,
            deckId: deck.id,
            title: round === 0 ? base.title : `${base.title} ${round + 1}`,
            front: base.front,
            back: base.back,
            // Mesmos ids do catálogo fictício (constants/mockSubjects): a disciplina do deck e o
            // tema do deck como conteúdo
            disciplineId: slugify(deck.discipline),
            contentId: deck.id,
          };
        });

  cache.set(deck.id, cards);
  return cards;
}
