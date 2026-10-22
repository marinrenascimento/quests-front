# Regras de negócio — Quests (front)

Regras que o app segue hoje, tiradas do código, da documentação e das definições do grupo. Serve de base para o back. Toda tela ou regra nova deve ser registrada aqui.

**Status**
- **Implementado no front (mock)**: funciona na interface, com dados fictícios ou em memória (some ao fechar o app).
- **Pendente de back**: a interface já existe ou está prevista, mas depende do back (salvar, buscar, validar no servidor).
- **A confirmar**: dúvida em aberto; a pergunta está escrita na regra.

> Para adicionar uma regra: use o próximo ID livre da área, descreva o comportamento de forma objetiva, diga em que tela ele vale e marque o status. Não apague IDs; se uma regra deixar de valer, marque como "Removida" e explique.

## 1. Contas e acesso (RN-001 a RN-019)

| ID | Regra | Onde | Status |
|----|-------|------|--------|
| RN-001 | O app abre sempre na tela de login. | Início do app | Implementado no front (mock) |
| RN-002 | Se já houver sessão salva, o app vai direto para a Home. | Início do app | Pendente de back |
| RN-003 | Login: usuário (sem contar espaços nas pontas) e senha são obrigatórios. O erro aparece abaixo do campo ao tocar em "Login" e some quando o usuário volta a digitar nele. | Login | Implementado no front (mock) |
| RN-004 | Login válido leva à Home sem deixar o login na pilha (não dá para "voltar" para ele). A autenticação de usuário e senha é feita no back. | Login | Pendente de back |
| RN-005 | "Lembrar de Mim" vem marcado por padrão. Guardar essa escolha depende do back. | Login, Cadastro | Pendente de back |
| RN-006 | Cadastro: nome, usuário, e-mail, senha e repetir senha são obrigatórios; o e-mail precisa ter formato válido; a senha repetida precisa ser igual à senha. Erros abaixo do campo, no mesmo padrão do login. | Cadastro de usuário | Implementado no front (mock) |
| RN-007 | Cadastro válido volta para o login. Criar a conta de verdade é feito no back. | Cadastro de usuário | Pendente de back |
| RN-008 | "Esqueceu Sua Senha?" aparece no login e no cadastro, mas ainda não tem tela. | Login, Cadastro | Pendente de back |
| RN-009 | A ajuda (Help > Conta) diz que a senha deve ter pelo menos 8 caracteres, com letras e números, mas o cadastro não confere isso. **Pergunta:** essa regra vale para o cadastro? | Cadastro de usuário, Help | A confirmar |

## 2. Decks (RN-020 a RN-039)

| ID | Regra | Onde | Status |
|----|-------|------|--------|
| RN-020 | Meus Decks mostra os decks em grade de 2 colunas: baú, título, descrição (1 linha) e quantidade de cards ("1 CARD", "53 CARDS", "1.250 CARDS"). Sem decks: "Nenhum Deck Encontrado". | Meus Decks | Implementado no front (mock) |
| RN-021 | A quantidade de cards de um deck é sempre a quantidade de cards dele (não é digitada). No deck criado, é a quantidade de cards vinculados. | Meus Decks, Cadastro de deck | Implementado no front (mock) |
| RN-022 | Cadastro de deck: o nome é obrigatório (erro abaixo do campo ao salvar, no padrão do cadastro de usuário). A descrição é opcional; sem descrição, o cartão em Meus Decks mostra a linha em branco. | Cadastro de deck | Implementado no front (mock) |
| RN-023 | Os botões "Salvar" e "Cancelar" do cadastro de deck só aparecem depois que o primeiro card for vinculado. Antes disso, só existem a seta de voltar e "Cadastrar Novo Card +". | Cadastro de deck | Implementado no front (mock) |
| RN-024 | "Cancelar" pergunta "Tem certeza que deseja cancelar o cadastro desse deck?" (Sim/Não). "Sim" descarta o rascunho (nome, descrição e cards vinculados) e volta para Meus Decks; "Não" só fecha o aviso. | Cadastro de deck | Implementado no front (mock) |
| RN-025 | "Salvar" cria o deck com nome, descrição, os cards vinculados e a quantidade de cards, limpa o rascunho e volta para Meus Decks, onde o deck novo aparece no início da grade. Hoje o deck fica só em memória. | Cadastro de deck, Meus Decks | Pendente de back |
| RN-026 | O deck criado funciona como os outros: abre em Cards do Deck com os cards vinculados e pode ser estudado em "Estudar Agora". | Meus Decks, Cards do Deck, Revisão | Implementado no front (mock) |
| RN-027 | O rascunho do deck (nome, descrição e cards vinculados) é mantido enquanto o usuário vai ao Novo Flashcard e volta. Ao sair do cadastro (voltar, salvar, cancelar ou trocar de aba), ele é descartado. | Cadastro de deck | Implementado no front (mock) |
| RN-028 | A seta de voltar do cadastro de deck sai direto, sem confirmação, mesmo com cards vinculados (o rascunho é perdido). **Pergunta:** a seta deve pedir confirmação como o "Cancelar"? | Cadastro de deck | A confirmar |
| RN-029 | O deck tem uma só disciplina, mas os cards vinculados podem ser de disciplinas diferentes. Hoje o deck criado recebe todas as disciplinas dos cards, sem repetir (ex.: "História, Física"). **Pergunta:** essa é a regra, ou o deck deve ter uma disciplina única? | Cadastro de deck, Cards do Deck | A confirmar |
| RN-030 | A ajuda diz que, ao criar um deck, o usuário "escolhe a matéria" e acessa por "Cards > + Novo Deck". No app, a disciplina é escolhida em cada card e o caminho é Meus Decks > "Criar Novo Deck". **Pergunta:** o texto da ajuda deve ser atualizado, ou o deck deve ter campo de matéria? | Help, Cadastro de deck | A confirmar |
| RN-031 | "Estudar por Disciplina" em Meus Decks abre Configurar Deck por Disciplina (ver RN-077 a RN-087). | Meus Decks | Implementado no front (mock) |
| RN-032 | Deck inexistente (link para um id que não existe): Cards do Deck e a revisão mostram "Deck Não Encontrado", sem botões de ação. | Cards do Deck, Revisão | Implementado no front (mock) |

## 3. Cards (RN-040 a RN-069)

| ID | Regra | Onde | Status |
|----|-------|------|--------|
| RN-040 | Cards do Deck mostra os cards em grade de 2 colunas, todos com o rótulo "Disciplina - Tema" do deck, o título e os botões editar, excluir e visualizar. Deck sem cards: "Nenhum Card Neste Deck". | Cards do Deck | Implementado no front (mock) |
| RN-041 | Excluir card: a lixeira pergunta "Tem certeza que deseja excluir o card:" com o título do card (Sim/Não). Hoje "Sim" só fecha o aviso; a exclusão é feita no back. | Cards do Deck | Pendente de back |
| RN-042 | ~~Visualizar card ainda não tem tela.~~ Substituída pelas RN-063 a RN-069 (Visualizar Card). ("Adicionar Card" num deck que já existe: ver RN-053; editar card: ver RN-056.) | Cards do Deck | Removida |
| RN-043 | Novo Flashcard: disciplina, conteúdo, frente e verso são obrigatórios. Ao tocar em "Salvar" com algum faltando, o erro aparece abaixo do campo e o card não é salvo. | Novo Flashcard | Implementado no front (mock) |
| RN-044 | Os botões "Salvar" e "Cancelar" do Novo Flashcard só aparecem quando frente e verso têm texto (sem contar espaços). Se um dos dois voltar a ficar vazio, os botões somem. O espaço deles fica reservado, para a tela não pular. | Novo Flashcard | Implementado no front (mock) |
| RN-045 | Disciplina: um campo só para pesquisar, escolher e criar. A busca não diferencia maiúsculas nem acentos; com o campo vazio, a lista mostra todas as disciplinas. Se nenhuma corresponder ao texto, a lista oferece criar a disciplina com o texto digitado, que já fica escolhida. | Novo Flashcard | Implementado no front (mock) |
| RN-046 | Conteúdo: funciona como a disciplina, mas depende dela. Fica desabilitado até uma disciplina ser escolhida, lista só os conteúdos dela, o conteúdo criado fica ligado a ela e, se a disciplina mudar, o conteúdo escolhido é limpo. | Novo Flashcard | Implementado no front (mock) |
| RN-047 | As disciplinas e os conteúdos criados no próprio campo continuam disponíveis para os próximos cards enquanto o app está aberto. Criá-los de verdade é feito no back. | Novo Flashcard | Pendente de back |
| RN-048 | A ação de criar só aparece quando nenhuma opção contém o texto digitado. Por isso não dá para criar um nome que faz parte de um já existente (ex.: "Arte" quando já existe "Artes"). **Pergunta:** é preciso permitir esse caso? | Novo Flashcard | A confirmar |
| RN-049 | "Cancelar" e a seta de voltar perguntam "Tem certeza que deseja cancelar a criação desse card?" (Sim/Não). "Sim" volta para a tela de onde o Novo Flashcard foi aberto (cadastro de deck ou Cards do Deck) sem salvar o card; "Não" só fecha o aviso. | Novo Flashcard | Implementado no front (mock) |
| RN-050 | O botão de voltar do Android e o gesto de voltar não passam pelo aviso de cancelar (no Novo Flashcard e no cadastro de deck). **Pergunta:** eles também devem pedir confirmação? | Novo Flashcard, Cadastro de deck | A confirmar |
| RN-051 | "Salvar" vincula o card ao deck em criação (frente, verso, disciplina e conteúdo), volta para o cadastro de deck e mostra por cerca de 2,5 s o aviso "Card Vinculado com Sucesso!". O card aparece em "Cards Vinculados" com "Disciplina - Conteúdo" e a frente. Salvar o card no back fica para depois. | Novo Flashcard, Cadastro de deck | Pendente de back |
| RN-052 | O card não tem campo de título; nos cards criados no app (deck novo ou "Adicionar Card"), o título mostrado em Cards do Deck é a frente do card, e ele acompanha a frente quando o card é editado. Nos cards fictícios, que têm título próprio, editar a frente não muda o título mostrado na grade (a mudança aparece na revisão). **Pergunta:** o card deve ter um título próprio, editável? | Cards do Deck, Editar Flashcard | A confirmar |
| RN-053 | "Adicionar Card" em Cards do Deck abre o Novo Flashcard (mesma tela, mesmas regras RN-043 a RN-050), em qualquer deck (fictício ou criado no app). "Salvar" coloca o card no fim do deck, a quantidade de cards do deck sobe em Meus Decks, e o app volta para Cards do Deck, que mostra por cerca de 2,5 s o aviso "Card Vinculado com Sucesso!". Hoje o card fica só em memória. | Cards do Deck, Novo Flashcard, Meus Decks | Pendente de back |
| RN-054 | No "Adicionar Card", a Disciplina já vem preenchida com a do deck, e o usuário pode trocar. Se o deck tiver mais de uma disciplina (RN-029), o campo começa vazio. | Novo Flashcard | Implementado no front (mock) |
| RN-055 | Em Cards do Deck, todos os cards mostram o rótulo "Disciplina - Tema" do deck, mesmo um card salvo ou editado com outra disciplina (a disciplina do card é guardada, mas não aparece na grade, e a disciplina do deck não muda). **Pergunta:** a grade deve mostrar a disciplina e o conteúdo de cada card? | Cards do Deck | A confirmar |
| RN-056 | A caneta de um card em Cards do Deck abre o Editar Flashcard com a disciplina, o conteúdo, a frente e o verso atuais do card já preenchidos. Vale para cards de decks fictícios e de decks criados no app. Nos cards fictícios, a disciplina é a do deck e o conteúdo é o tema do deck. | Cards do Deck, Editar Flashcard | Implementado no front (mock) |
| RN-057 | No Editar Flashcard, "Cancelar" está sempre visível. Ele e a seta de voltar saem direto para Cards do Deck, sem confirmação, descartando as alterações. | Editar Flashcard | Implementado no front (mock) |
| RN-058 | A seta e o "Cancelar" do Editar Flashcard descartam alterações sem avisar. **Pergunta:** deve haver confirmação quando houver alteração não salva? | Editar Flashcard | A confirmar |
| RN-059 | No Editar Flashcard, "Salvar" só aparece quando algum valor for diferente do original (disciplina, conteúdo, frente ou verso; textos comparados sem os espaços das pontas). Se os valores voltarem aos originais, o "Salvar" some. O lugar do botão fica reservado, para a tela não pular. | Editar Flashcard | Implementado no front (mock) |
| RN-060 | No Editar Flashcard, disciplina, conteúdo, frente e verso continuam obrigatórios. Ao salvar com algum vazio, o erro aparece abaixo do campo e nada é salvo. Trocar a disciplina limpa o conteúdo, que precisa ser escolhido de novo (como no Novo Flashcard, RN-046). | Editar Flashcard | Implementado no front (mock) |
| RN-061 | "Salvar" aplica as alterações ao card, mantendo a posição dele no deck, e volta para Cards do Deck. O card alterado aparece em Cards do Deck e na revisão. Hoje a alteração fica só em memória. | Editar Flashcard, Cards do Deck, Revisão | Pendente de back |
| RN-062 | Card inexistente (link para um card que não existe no deck): a tela mostra "Card Não Encontrado" no lugar do formulário, e a seta de voltar leva para o deck. | Editar Flashcard | Implementado no front (mock) |
| RN-063 | O olho de um card em Cards do Deck abre o Visualizar Card daquele card, em decks fictícios e em decks criados no app. A tela é somente leitura: nenhum campo é editável (sem cursor, teclado, placeholder ou lista de opções), não há "Salvar" nem "Cancelar" e nada do card é alterado. | Cards do Deck, Visualizar Card | Implementado no front (mock) |
| RN-064 | O Visualizar Card mostra, nesta ordem, Disciplina, Conteúdo, Frente do Card e Verso do Card, cada um com rótulo e valor, no visual dos campos do formulário. Textos longos aparecem inteiros: os valores quebram em várias linhas e a tela rola. Nos cards fictícios, a disciplina é a do deck e o conteúdo é o tema do deck (como na RN-056). Um card alterado no Editar Flashcard já aparece com os valores novos. | Visualizar Card | Implementado no front (mock) |
| RN-065 | O olho no canto superior direito do cabeçalho do Visualizar Card só indica que a tela é de visualização: não é botão, não faz nada ao toque e não é lido pelo leitor de tela. | Visualizar Card | Implementado no front (mock) |
| RN-066 | A seta de voltar do Visualizar Card volta para Cards do Deck sem confirmação (não há nada para perder). Aberta sem histórico (ex.: link direto), vai para os cards do deck. | Visualizar Card | Implementado no front (mock) |
| RN-067 | Card ou deck inexistente (link para um id que não existe): o Visualizar Card mostra "Card Não Encontrado" no lugar dos dados, sem título, e a seta de voltar leva para o deck (mesmo estado da RN-062). | Visualizar Card | Implementado no front (mock) |
| RN-068 | O título do Visualizar Card é Card "título do card", com o mesmo título mostrado na grade de Cards do Deck e no aviso de excluir (RN-041): nos cards fictícios, o título próprio deles; nos criados no app, a frente (RN-052). Só nesta tela, um título com mais de 30 caracteres é cortado com "..." (ex.: Card "Substantivo concreto e abstrat..."); o título guardado no card não muda. O título ocupa até 2 linhas e a fonte diminui se precisar. (Se o card deve ter um título próprio e editável continua em aberto na RN-052.) | Visualizar Card | Implementado no front (mock) |
| RN-069 | Os dados do Visualizar Card vêm da mesma fonte em memória de Meus Decks e Cards do Deck. Buscar o card (disciplina, conteúdo, frente e verso) no back fica para depois. | Visualizar Card | Pendente de back |

## 4. Estudo e revisão (RN-070 a RN-089)

| ID | Regra | Onde | Status |
|----|-------|------|--------|
| RN-070 | "Estudar Agora" abre a revisão do deck. A revisão sempre começa do primeiro card, de frente e sem dificuldade marcada; o progresso não é guardado. | Revisão | Implementado no front (mock) |
| RN-071 | Virar o card alterna entre a frente (rótulo "FRONT") e o verso (rótulo "BACK"). | Revisão | Implementado no front (mock) |
| RN-072 | Há 4 dificuldades: Fácil, Médio, Difícil e Impossível. Só uma fica marcada por vez; tocar na marcada desmarca. Marcar uma não é obrigatório para avançar. | Revisão | Implementado no front (mock) |
| RN-073 | Avançar mostra a frente do próximo card e limpa a dificuldade. Depois do último card aparece "Revisão Concluída!", com o botão "Voltar para o Início", que volta para os cards do deck. | Revisão | Implementado no front (mock) |
| RN-074 | "Encerrar Revisão" com um card na tela pergunta "Tem certeza que deseja encerrar a revisão do card:" com o nome do deck (Sim/Não). "Sim" volta para os cards do deck; "Não" mantém o card, o lado e a dificuldade. No fim da revisão, ou com o deck vazio ou inexistente, sai direto. | Revisão | Implementado no front (mock) |
| RN-075 | Deck sem cards: o card mostra "Nenhum Card para Revisar" (rótulo "FIM") e os controles somem. | Revisão | Implementado no front (mock) |
| RN-076 | Salvar a dificuldade de cada card, o progresso e o resultado da revisão é feito no back. **Pergunta:** o que a dificuldade marcada muda (ex.: quando o card volta a aparecer)? | Revisão | A confirmar |
| RN-077 | O estudo por disciplina usa um deck temporário: ele não aparece em Meus Decks e não é salvo. Existe só enquanto o app está aberto, até o próximo "Estudar Agora". | Configurar Deck por Disciplina, Revisão | Implementado no front (mock) |
| RN-078 | Disciplina e conteúdo são escolhidos entre os que já existem: há pesquisa (sem diferenciar maiúsculas nem acentos), mas não há criação. Pesquisa sem resultado mostra "Nenhuma Disciplina Encontrada" ou "Nenhum Conteúdo Encontrado". | Configurar Deck por Disciplina | Implementado no front (mock) |
| RN-079 | Só aparecem disciplinas com pelo menos 1 card, e só os conteúdos que têm cards naquela disciplina, considerando os decks fictícios e os criados no app. | Configurar Deck por Disciplina | Implementado no front (mock) |
| RN-080 | O conteúdo depende da disciplina: fica desabilitado até uma disciplina ser escolhida, lista só os conteúdos dela e é limpo quando a disciplina muda. | Configurar Deck por Disciplina | Implementado no front (mock) |
| RN-081 | A quantidade de flashcards é escolhida numa lista simples, sem pesquisa: 5, 10, 15, 20, 25 ou 30. | Configurar Deck por Disciplina | Implementado no front (mock) |
| RN-082 | Disciplina, conteúdo e quantidade são obrigatórios. "Estudar Agora" fica sempre visível; ao tocar com algum faltando, o erro aparece abaixo do campo e a revisão não começa (mesmo padrão do Novo Flashcard). | Configurar Deck por Disciplina | Implementado no front (mock) |
| RN-083 | "Estudar Agora" monta o deck temporário com os cards da disciplina + conteúdo escolhidos e abre a mesma revisão dos outros decks (mesmos controles, mesmo "Revisão Concluída"), com o nome "Disciplina - Conteúdo" no cabeçalho. | Configurar Deck por Disciplina, Revisão | Implementado no front (mock) |
| RN-084 | Com menos cards do que a quantidade escolhida, a revisão usa todos os cards disponíveis. **Pergunta:** isso vale, ou as quantidades maiores que o disponível devem ficar desabilitadas? | Configurar Deck por Disciplina | A confirmar |
| RN-085 | Com mais cards do que a quantidade escolhida, os cards são sorteados sem repetir card. Cada "Estudar Agora" faz um novo sorteio. **Pergunta:** o sorteio vale, ou devem entrar os primeiros cards na ordem? | Configurar Deck por Disciplina | A confirmar |
| RN-086 | "Encerrar Revisão" (com a mesma confirmação da RN-074) e "Voltar para o Início" voltam para Configurar Deck por Disciplina, com as escolhas mantidas. | Revisão | Implementado no front (mock) |
| RN-087 | "Cancelar" e a seta de voltar perguntam "Tem certeza que deseja cancelar a configuração do estudo?" (Sim/Não). "Sim" volta para Meus Decks; "Não" só fecha o aviso. | Configurar Deck por Disciplina | Implementado no front (mock) |
| RN-088 | A revisão aberta sem estudo configurado (ex.: link direto) mostra "Nenhum Estudo Configurado", e o botão de encerrar leva para a configuração. | Revisão | Implementado no front (mock) |
| RN-089 | Registrar no back a sessão de estudo por disciplina (cards estudados e dificuldades) fica para depois. **Pergunta:** essa sessão deve contar para relatórios e moedas como a revisão de um deck? | Revisão | A confirmar |

## 5. Gamificação e moedas (RN-090 a RN-109)

| ID | Regra | Onde | Status |
|----|-------|------|--------|
| RN-090 | O TopBar mostra as moedas do usuário (com ponto de milhar) e o nome dele. Hoje os valores são temporários. | Todas as telas com TopBar | Pendente de back |
| RN-091 | O Rank mostra o pódio (3 primeiros), a lista de jogadores e o cartão do usuário (posição, pontos e nível). A posição vem pronta nos dados. | Rank | Pendente de back |
| RN-092 | Segundo a ajuda, o ranking é baseado nas moedas acumuladas, e os jogos "concedem XP e contam para o ranking". **Pergunta:** os pontos do Rank são as moedas ou o XP? Como se ganham moedas? | Rank, Help | A confirmar |
| RN-093 | Os níveis do ranking são Diamante, Esmeralda, Rubi, Ametista e Bronze. **Pergunta:** qual é o critério de cada nível? | Rank | A confirmar |
| RN-094 | A ajuda diz que novos avatares são desbloqueados ao subir de nível. **Pergunta:** qual é a regra de desbloqueio? | Help, Conta | A confirmar |

## 6. Navegação (RN-110 a RN-129)

| ID | Regra | Onde | Status |
|----|-------|------|--------|
| RN-110 | O TopBar tem as abas Home, Rank e Help. Trocar de aba não empilha telas. Ao sair de Meus Decks ou da Help, a pilha dessas abas volta para a primeira tela. | Todas as telas com TopBar | Implementado no front (mock) |
| RN-111 | Menu da Home: Questões abre Minhas Provas (ver RN-130), Decks abre Meus Decks e Relatórios abre os Relatórios; Jogos ainda não tem tela. | Home | Pendente de back |
| RN-112 | Os acessos recentes da Home ainda ficam vazios. | Home | Pendente de back |
| RN-113 | Telas abertas por cima de outra (cadastro de deck, Novo Flashcard, Cards do Deck, revisão) voltam para a tela de baixo. Abertas sem histórico (ex.: link direto), vão para a tela de origem. A seta de Meus Decks leva à Home. | Meus Decks e telas abertas a partir dela | Implementado no front (mock) |
| RN-114 | Relatórios alterna entre semanal e mensal; ao sair da tela, volta para o semanal e para o topo. | Relatórios | Implementado no front (mock) |

## 7. Provas e questões (RN-130 a RN-149)

| ID | Regra | Onde | Status |
|----|-------|------|--------|
| RN-130 | "Questões" no menu da Home abre Minhas Provas, que mostra as provas do usuário em grade de 2 colunas: baú, nome da prova (até 2 linhas; a fonte diminui se não couber) e a quantidade de questões. Hoje as provas são fictícias. | Home, Minhas Provas | Implementado no front (mock) |
| RN-131 | A quantidade de questões usa o singular quando é 1 ("1 QUESTÃO") e o plural nos outros casos ("53 QUESTÕES"), com ponto de milhar a partir de 1.000. | Minhas Provas | Implementado no front (mock) |
| RN-132 | Sem provas, a tela mostra "Nenhuma Prova Cadastrada Ainda..." no lugar da grade (os botões continuam). O mockup não mostra esse estado; o texto segue o padrão dos outros estados vazios. | Minhas Provas | Implementado no front (mock) |
| RN-133 | A lista de provas rola, levando junto o cabeçalho e os botões. Buscar as provas do usuário e carregar mais provas ao chegar ao fim da lista é feito no back. | Minhas Provas | Pendente de back |
| RN-134 | Os botões "Criar Nova Prova", "Vestibulares" e "Estudar por Disciplina" ainda não têm tela: o toque não faz nada. | Minhas Provas | Pendente de back |
| RN-135 | Tocar numa prova abre as questões dela (ver RN-137). | Minhas Provas | Implementado no front (mock) |
| RN-136 | A seta de voltar de Minhas Provas volta para a Home, sem confirmação. | Minhas Provas | Implementado no front (mock) |
| RN-137 | A tela de questões de uma prova mostra o nome da prova no cabeçalho (uma linha; a fonte diminui se não couber) e as questões dela em grade de 2 colunas. Vale para todas as provas de Minhas Provas. | Questões da Prova | Implementado no front (mock) |
| RN-138 | Cada card de questão mostra "Disciplina - Conteúdo" (uma linha, com reticências), o enunciado (até 2 linhas, em caixa alta, com reticências) e, embaixo, a dificuldade e os botões editar, excluir e visualizar. | Questões da Prova | Implementado no front (mock) |
| RN-139 | A quantidade de questões de uma prova em Minhas Provas é sempre a quantidade de questões dela (não é digitada), como nos decks (RN-021). | Minhas Provas, Questões da Prova | Implementado no front (mock) |
| RN-140 | Cada questão tem uma dificuldade: Fácil, Médio ou Difícil. **Pergunta:** quem define a dificuldade (quem cria a questão, a banca)? Ela tem relação com as 4 dificuldades que o usuário marca na revisão de flashcards (RN-072)? | Questões da Prova | A confirmar |
| RN-141 | Hoje a questão tem disciplina, conteúdo, enunciado, dificuldade e 5 alternativas (A a E, pela posição). **Pergunta:** quais são os outros campos (gabarito, imagem, número da questão na prova original)? Toda questão tem exatamente 5 alternativas? | Questões da Prova, Realização da Prova | A confirmar |
| RN-142 | Prova sem questões: "Nenhuma Questão Nesta Prova", com o cabeçalho e os botões visíveis. Prova inexistente (link para um id que não existe): "Prova Não Encontrada", sem nome e sem botões; a seta de voltar continua funcionando. | Questões da Prova | Implementado no front (mock) |
| RN-143 | A seta de voltar volta para Minhas Provas, sem confirmação. Aberta sem histórico (ex.: link direto), vai para Minhas Provas. | Questões da Prova | Implementado no front (mock) |
| RN-144 | "Estudar Agora" abre a realização da prova (ver RN-150). "Adicionar Questão" ainda não tem tela: o toque não faz nada. | Questões da Prova | Pendente de back |
| RN-145 | Os botões editar, excluir e visualizar de cada questão e o toque no card ainda não fazem nada. A exclusão deverá pedir confirmação, como a de um card (RN-041). | Questões da Prova | Pendente de back |
| RN-146 | **Pergunta:** quem pode editar ou excluir uma questão (ex.: as questões das provas de vestibular podem ser alteradas pelo usuário)? | Questões da Prova | A confirmar |
| RN-147 | A lista de questões rola, levando junto o cabeçalho e os botões. Hoje as questões aparecem na ordem dos dados fictícios. Buscar as questões no back e carregar mais ao chegar ao fim da lista fica para depois. **Pergunta:** qual é a ordem das questões (a da prova original)? | Questões da Prova | Pendente de back |

## 8. Realização de prova (RN-150 a RN-169)

| ID | Regra | Onde | Status |
|----|-------|------|--------|
| RN-150 | "Estudar Agora" na tela de questões de uma prova abre a realização da prova, com todas as questões dela numa lista, uma abaixo da outra. Cada card mostra "QUESTÃO N" (N é a posição na prova), a dificuldade em estrelas, "Disciplina · Conteúdo", o enunciado completo e as 5 alternativas (A a E). Vale para todas as provas. | Realização da Prova | Implementado no front (mock) |
| RN-151 | Tocar numa alternativa a escolhe (só uma por questão); tocar em outra troca a resposta; tocar de novo na escolhida desmarca, e a questão volta a não respondida. A contagem "X de Y respondidas" (singular quando o total é 1) e o navegador de questões atualizam na hora. Não há certo nem errado na tela. | Realização da Prova | Implementado no front (mock) |
| RN-152 | "Entregar prova" pergunta "Tem certeza que deseja entregar a prova:" com o nome da prova e o resumo "Foram respondidas X de Y questões." ("Foi respondida 1..."; "... de 1 questão."). "Sim" volta para as questões da prova; "Não" só fecha. Hoje dá para entregar com questões em branco. Enviar as respostas, corrigir e mostrar o resultado dependem do back e de uma tela que ainda não tem mockup. | Realização da Prova | Pendente de back |
| RN-153 | Sair da prova ("Sair da prova", voltar do Android ou uma aba do TopBar) pergunta "Tem certeza que deseja sair da prova:" com o nome da prova. "Sim" descarta respostas e marcações e vai para as questões da prova (ou, se a saída foi por uma aba, para a aba tocada); "Não" só fecha, sem perder nada. O gesto de voltar por deslize fica desligado nesta tela. | Realização da Prova | Implementado no front (mock) |
| RN-154 | A questão atual é a primeira com pelo menos metade do card visível na lista; ao abrir, é a 1. No navegador, a atual tem um anel amarelo e as respondidas ficam preenchidas de verde escuro. Tocar num número torna aquela questão a atual e rola a lista até ela. Com muitas questões, o navegador rola na horizontal e acompanha a questão atual. | Realização da Prova | Implementado no front (mock) |
| RN-155 | Marcador de texto: tocar numa bolinha (azul, amarela ou vermelha; começa na amarela) escolhe a cor e liga o marcador; o lápis liga e desliga. Ligado, o usuário toca na primeira e na última palavra de um trecho do enunciado (em qualquer ordem; duas vezes na mesma marca só ela) e o trecho recebe a cor. Se o trecho já estiver todo com a cor escolhida, a marcação sai; com outra cor, troca. Só o enunciado pode ser marcado. Trocar de questão ou ligar/desligar o marcador cancela o primeiro toque. As marcações começam vazias e existem só enquanto a tela está aberta. | Realização da Prova | Implementado no front (mock) |
| RN-156 | A dificuldade aparece em 5 estrelas: Fácil = 1, Médio = 3 e Difícil = 5. **Pergunta:** a dificuldade da questão deve ter uma escala própria de 1 a 5? | Realização da Prova | A confirmar |
| RN-157 | Prova sem questões: "0 de 0 respondidas", sem navegador, a mensagem "Nenhuma Questão Nesta Prova", "Entregar prova" desabilitado e "Sair da prova" sai direto. Prova inexistente (link para um id que não existe): "Prova Não Encontrada", com a seta de voltar. | Realização da Prova | Implementado no front (mock) |
| RN-158 | **Pergunta:** a prova tem tempo limite? Se tiver, o que acontece quando o tempo acaba? | Realização da Prova | A confirmar |
| RN-159 | Hoje sair da prova descarta tudo, e a próxima vez começa do zero. **Pergunta:** o usuário pode sair e voltar depois, continuando de onde parou (respostas e marcações salvas)? | Realização da Prova | A confirmar |
| RN-160 | **Pergunta:** pode entregar a prova com questões em branco, ou a entrega exige todas respondidas? E pode refazer uma prova já entregue? | Realização da Prova | A confirmar |
