# Auditoria de Acessibilidade — WCAG 2.2 Quiz

Ferramenta automatizada: axe-core v4.11 via `@axe-core/playwright` + Playwright (Chromium)
Comando: `npm run a11y`

Cenas auditadas (cobertura atual): IntroScreen, QuizScreen-Q1, ReportScreen (13 × "Sim") e ReportScreen-expandido, cada uma em português e em inglês — oito cenas, quatro estados × dois idiomas. Cobertura estabelecida na rodada de 30/08/2026.

Rodadas registradas neste documento:

- **2026-05-28** — auditoria inicial dos 11 itens críticos (três telas, em português, `<details>` fechados)
- **2026-08-30** — auditoria bilíngue estendida (oito cenas)
- **2026-10-02** — verificação manual de teclado e regressão de idioma

---

## Rodada de 28/05/2026: auditoria dos 11 itens críticos

Data: 2026-05-28

Escopo desta rodada: três telas — IntroScreen, QuizScreen-Q1 e ReportScreen (13 × "Sim") —, em português, com os `<details>` fechados. Os onze itens abaixo são desta rodada.

---

## Item 1 — `<html lang="pt-BR">`

Método de verificação: Coberto pelo `npm run a11y` — axe verifica `html-has-lang` e `valid-lang` em todas as telas.

Resultado: ✓ Atende

Observação: Zero violations de `html-has-lang` ou `valid-lang`. Verificado nas três telas desta rodada e, desde 30/08/2026, nas oito cenas da cobertura atual (quatro estados × dois idiomas).

---

## Item 2 — Skip link visível ao receber foco

Método de verificação: Manual. No browser, pressionar Tab na IntroScreen imediatamente após carregar a página. O skip link deve aparecer no canto superior esquerdo sobre fundo verde (#2D3F2D) com texto branco.

Resultado: ✓ Atende

Observação: Implementado via `.skip-link:focus-visible` em `src/index.css`. O link aponta para `#main` e fica `position: fixed; top: 1rem; left: 1rem` ao receber foco. Verificado manualmente durante o desenvolvimento.

---

## Item 3 — `<main id="main">` único

Método de verificação: Coberto pelo `npm run a11y` — axe verifica `landmark-one-main` e `landmark-unique`. Verificação complementar: `grep -n '<main' src/App.tsx`.

Resultado: ✓ Atende

Observação: Zero violations de `landmark-one-main`. Escopo desta verificação: as três telas desta rodada, em português, no estado padrão (`<details>` fechados), até 28/05/2026. Único `<main id="main">` renderizado em `src/App.tsx`.

---

## Item 4 — `<h1>` único por tela

Método de verificação: Coberto pelo `npm run a11y` — axe verifica `page-has-heading-one`. Verificação complementar: inspecionar o DOM em cada tela.

Resultado: ✓ Atende

Observação: Zero violations de `page-has-heading-one` nas três telas desta rodada, em português, no estado padrão. Cada screen renderiza exatamente um `<h1>` com `tabIndex={-1}` para foco programático na transição de tela.

Este item **não cobre a hierarquia de headings abaixo do `<h1>`**. Com os `<details>` fechados, o conteúdo interno dos critérios ficava fora da árvore de acessibilidade e a regra `heading-order` não tinha o que avaliar. A rodada de 30/08/2026 ampliou a cobertura para o relatório expandido e encontrou um salto de h2 para h4 — ver a seção 3 daquela rodada, a seção 4 (por que as rodadas anteriores não a detectaram) e o Histórico de correções.

---

## Item 5 — Interação via `<button>`, nunca `<div onClick>`

Método de verificação: Coberto parcialmente pelo `npm run a11y` — axe verifica `interactive-supports-focus` e `keyboard`. Verificação complementar: `grep -rn "onClick" src/` confirma que todos os handlers de clique estão em elementos `<button>` ou `<a>` nativos.

Resultado: ✓ Atende

Observação: Zero violations de `interactive-supports-focus`. Escopo desta verificação: as três telas desta rodada, em português, no estado padrão (`<details>` fechados), até 28/05/2026. Nenhum `<div onClick>` encontrado no codebase.

---

## Item 6 — min-height/min-width 44px em botões

Método de verificação: Coberto parcialmente pelo `npm run a11y` — axe verifica `target-size` (regra WCAG 2.5.8). Verificação complementar: todos os botões usam `min-h-[44px]` via Tailwind.

Resultado: ✓ Atende

Observação: Zero violations de `target-size`. Escopo desta verificação: as três telas desta rodada, em português, no estado padrão (`<details>` fechados), até 28/05/2026. Todos os botões interativos têm `min-h-[44px]` aplicado. Checkboxes (`w-4 h-4`) ficam abaixo de 44px mas são acompanhados de `<label>` clicável — área de toque efetiva atende ao critério.

---

## Item 7 — Foco com `:focus-visible` (não `:focus`)

Método de verificação: Manual + revisão de código. O CSS global em `src/index.css` usa seletores `:focus-visible` exclusivamente. axe verifica `focus-visible` onde aplicável.

Resultado: ✓ Atende

Observação: Zero violations de `focus-visible`. Escopo desta verificação: as três telas desta rodada, em português, no estado padrão (`<details>` fechados), até 28/05/2026. O outline global (`3px solid #2D3F2D`) só aparece em navegação por teclado, não em cliques com mouse. Todos os botões usam `focus-visible:ring-2 focus-visible:ring-[#2D3F2D]` via Tailwind.

---

## Item 8 — Estado nunca indicado só por cor

Método de verificação: Revisão de código + inspeção visual. Verificar que cada estado (resposta selecionada, critério implementado, destaque por público) tem indicador não-cromático.

Resultado: ✓ Atende

Observação: Resposta selecionada no QuizScreen: marcador `✓` (texto) dentro de círculo preenchido + `font-weight` mais alto — não depende só de cor. Critério implementado no ReportScreen: `border-t-[#2D3F2D]` (4px, top) + checkbox marcado — dois indicadores independentes. Critério destacado por público: `border-l-[#2D3F2D]` (4px, esquerda) + badge "Relevante para: ..." em texto.

---

## Item 9 — `prefers-reduced-motion` respeitado

Método de verificação: Manual. Em `src/index.css`, o bloco `@media (prefers-reduced-motion: reduce)` zera `animation-duration`, `animation-iteration-count`, `transition-duration` e `scroll-behavior`. Para testar: no DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". Todas as transições de cor nos botões devem ser instantâneas.

Resultado: ✓ Atende

Observação: O bloco cobre `*`, `*::before`, `*::after` com `!important` — sobrescreve qualquer `transition-duration` definida inline ou via Tailwind. Verificado manualmente durante o desenvolvimento.

---

## Item 10 — `aria-live="polite"` anuncia mudanças

Método de verificação: Manual com leitor de tela. Procedimento:
1. Abrir o QuizScreen com VoiceOver (Mac: Cmd+F5) ou NVDA (Windows).
2. Clicar em uma resposta com o mouse.
3. O leitor de tela deve anunciar o texto da próxima pergunta sem que o foco tenha se movido manualmente.

Resultado: ✓ Atende

Observação: `src/screens/QuizScreen.tsx` possui uma região `aria-live="polite" aria-atomic="true"` com o texto da pergunta atual. A mudança de pergunta por clique de mouse (sem movimento de foco) é anunciada pelo leitor de tela via essa região. A lógica usa `lastAnnouncedIndex` ref para evitar anúncio espúrio no primeiro render.

Verificação manual: ao mudar de pergunta no app, o textContent da região `aria-live="polite"` atualiza com o texto correto. Exemplos coletados via console em DevTools:
- Pergunta 2: "Pergunta 2 de 13: O sistema terá áudio ou vídeo?"
- Pergunta 3: "Pergunta 3 de 13: A interface usa cabeçalhos, tabelas ou estrutura semântica?"

---

## Item 11 — `localStorage` com fallback gracioso

Método de verificação: Manual via console do browser. Procedimento:
1. Abrir DevTools → Application → Storage → Local Storage → excluir a chave `wcag-quiz-state-v2`.
2. Recarregar. O app deve iniciar normalmente na IntroScreen.
3. Alternativa: `localStorage.setItem('wcag-quiz-state-v2', 'invalido')` e recarregar. O app deve ignorar o valor corrompido e iniciar na IntroScreen.

Resultado: ✓ Atende

Observação: `src/hooks/usePersistedReducer.ts` envolve a leitura do localStorage em `try/catch` e chama `isValidState()` que verifica a presença de campos obrigatórios (`implementado`, `publicosAtivos`). Estado inválido ou ausente retorna silenciosamente para `initialState`. O storage key `wcag-quiz-state-v2` foi bumped da v1 justamente para tratar estado legado.

Verificação manual: com `Object.defineProperty(window, 'localStorage', { get: () => { throw new Error('blocked'); } })` aplicado no console e F5 subsequente, o app subiu normalmente exibindo a IntroScreen sem erros vermelhos no console.

---

## Sumário automatizado — estado final

Última execução de `npm run a11y` (02/10/2026), nas oito cenas da cobertura atual:

| Cena                   | Idioma    | Violations |
|------------------------|-----------|------------|
| IntroScreen            | português | 0          |
| QuizScreen-Q1          | português | 0          |
| ReportScreen           | português | 0          |
| ReportScreen-expandido | português | 0          |
| IntroScreen            | inglês    | 0          |
| QuizScreen-Q1          | inglês    | 0          |
| ReportScreen           | inglês    | 0          |
| ReportScreen-expandido | inglês    | 0          |

Zero violações detectáveis pelo axe não equivale a conformidade com a WCAG 2.2 — ver os limites na seção 7 da rodada de 30/08/2026.

### Histórico de correções

**`heading-order` (moderate), rodada de 30/08/2026 — commit `0c453e7`.** Nas duas cenas ReportScreen-expandido, em pt e en, a hierarquia saltava do h2 (princípio POUR) direto para o h4 (Persona, User Story, Cenário), porque o nome do critério estava marcado como `<span>`. A correção promoveu o nome a `<h3>` em `CriterioItem`, em `src/screens/ReportScreen.tsx`. Detalhes, classificação da regra e o motivo de não ter sido detectada antes: rodada de 30/08/2026, seções 3 a 5.

**`color-contrast` (serious), rodada de 28/05/2026.** Primeira execução detectou violations de `color-contrast` (serious) em IntroScreen e ReportScreen, originadas de classes Tailwind com opacidade baixa (`text-[#1A1A1A]/60`, `/50`, `/40`) que produziam contraste abaixo do threshold AA de 4.5:1 sobre o fundo `#FAFAF7`. A correção substituiu todas as ocorrências por `text-[#5C5C5C]` (contraste ~6.7:1 sobre `#FAFAF7`, atende AA com margem). Hierarquia visual entre textos primário e secundário é mantida via tamanho e peso de fonte, não cor.

---

## Rodada de 30/08/2026: auditoria bilíngue estendida

### 1. Motivação

A versão bilíngue (pt/en) mudou a unidade de cobertura da auditoria. Até então cada tela existia em um único idioma, e `scripts/a11y.mjs` percorria três cenas em português, com seletores acoplados ao texto em pt. Com a i18n, cada tela passou a ter duas variantes, e uma auditoria só em português deixaria metade da interface sem verificação. Esta rodada refez a cobertura.

Convém separar duas coisas: a i18n motivou a revisão da cobertura, mas não revelou o problema descrito adiante. Quem o revelou foi a própria revisão, ao ampliar o que o script analisava.

### 2. Escopo e método

Foram auditadas oito cenas, resultado de quatro estados em dois idiomas: IntroScreen, QuizScreen-Q1, ReportScreen (com os `<details>` fechados) e ReportScreen-expandido, cada uma em pt e en. A Report aparece duas vezes porque os estados testam coisas diferentes: o colapsado verifica os `<summary>` como controles no estado padrão, e o expandido verifica o conteúdo interno de cada critério (Persona, User Story e Cenário). A Report é gerada respondendo "Sim" às 13 perguntas do quiz, o que renderiza os 86 critérios e os quatro grupos POUR, a superfície mais densa possível.

A ferramenta é axe-core 4.11.4 (via `@axe-core/playwright`) executado com Playwright/Chromium contra o servidor de desenvolvimento. O `AxeBuilder` é chamado sem `withTags()`, `withRules()` ou `disableRules()`, portanto roda o conjunto padrão, que inclui as regras de boas práticas da Deque além das regras WCAG. Esse detalhe é relevante para a seção 3.

O script mudou em quatro pontos em relação às rodadas anteriores:

- Os seletores foram extraídos para um mapa por idioma (`SELECTORS`), derivado dos valores reais de `src/i18n/pt.ts` e `src/i18n/en.ts`.
- Cada idioma roda em um contexto novo do Playwright, com `localStorage` limpo, para não vazar estado entre as passadas.
- Antes da cena expandida, o script aciona "Expandir todos" e aguarda, via `page.waitForFunction`, que a contagem de `details[open]` seja igual à de `details`.
- As esperas arbitrárias (`waitForTimeout(120)` no loop das perguntas) foram substituídas por esperas pela mudança real de estado da interface. Nas perguntas 1 a 12, a âncora é a mudança do `aria-valuenow` do `[role="progressbar"]` em relação ao valor lido antes do clique. Na pergunta 13, o progressbar desmonta na troca de quiz para relatório, então a âncora passa a ser o heading do relatório ("Critérios de sucesso" em pt, "Success Criteria" em en). A entrada no quiz espera o próprio progressbar. Não resta nenhum `waitForTimeout` no script.

O script acumula as violações das oito cenas e só então sai, com exit code 0 se o total for zero e 1 caso contrário. Em 02/10/2026 (commit `503b6a3`), `npm run a11y` passou a subir o servidor de desenvolvimento sozinho (via `start-server-and-test`) e a derrubá-lo ao final.

### 3. Resultado

Apareceu uma única regra, `heading-order` (impacto moderate), apenas nas duas cenas ReportScreen-expandido, com os mesmos alvos em pt e en. A hierarquia saltava do h2 (princípio POUR) direto para o h4 (Persona, User Story, Cenário), sem nível 3, porque o nome do critério, que funciona como título de subseção, estava marcado como `<span>`.

Sobre a classificação: no axe-core, `heading-order` é uma regra de boa prática da Deque, sem critério de sucesso WCAG associado. A relação mais próxima é com o 1.3.1 Informações e Relações (Nível A), mas pular um nível de cabeçalho não é, por si só, uma falha documentada do 1.3.1. Este registro trata o achado como problema de estrutura de navegação, relevante para quem usa leitor de tela, e não como não conformidade de Nível A. Ele só foi detectado porque o script roda o conjunto padrão de regras; uma auditoria filtrada por `wcag2a`/`wcag2aa`/`wcag22aa` não o acusaria. Se o script passar a restringir as tags, esse tipo de achado deixa de ser detectado, e isso precisa ser registrado.

A violação idêntica nos dois idiomas indica origem estrutural, não de tradução: o JSX da Report é um só, e apenas o texto é localizado. O problema já existia na versão em português antes da i18n.

### 4. Por que as rodadas anteriores não a detectaram

Com um `<details>` fechado, o navegador não renderiza o conteúdo além do `<summary>`, e esse conteúdo fica fora da árvore de acessibilidade. O axe avalia o que está exposto nessa árvore no momento da análise. Os h4 de Persona, User Story e Cenário não existiam, do ponto de vista da ferramenta, enquanto os `<details>` estavam fechados; com o h2 seguido apenas de outros h2, não havia salto a detectar.

As rodadas anteriores rodavam com os `<details>` fechados porque o script nunca os abria. Os "zero violations" reportados antes eram verdadeiros para o conteúdo analisado, mas não diziam nada sobre o bloco de Persona, User Story e Cenário dos 86 critérios, que é a parte mais extensa do relatório e contém a hierarquia interna de cabeçalhos. Era ausência de evidência, não evidência de ausência. Afirmações anteriores de "Zero violations em todas as telas", no README e neste documento, devem ser lidas com essa ressalva: cobriam as telas no estado padrão, não todos os estados alcançáveis.

A lição metodológica vale além deste caso: auditoria automatizada cobre estados, não telas. Conteúdo que só aparece após interação (acordeões, abas, modais, mensagens de erro, carregamento) é um ponto cego sistemático se o script não levar a interface a esse estado antes da análise. Por isso, a partir desta rodada, as cenas são nomeadas por estado (`ReportScreen` e `ReportScreen-expandido`) e a cobertura é uma lista de estados verificada contra o script.

### 5. Correção

No componente `CriterioItem`, em `src/screens/ReportScreen.tsx`, o `<span>` que envolve `{criterio.nome}` foi trocado por um `<h3>` com as mesmas classes. Os h2 dos princípios, os h4 internos e o `<span>` do `criterio.id` (metadado, não título) ficaram intactos. Commit `0c453e7`: *a11y: promote criterion name to h3, fixes heading-order in expanded report*.

A hierarquia resultante é h1 (título do relatório) > h2 (princípio POUR) > h3 (critério) > h4 (Persona, User Story, Cenário). Rebaixar os h4 para h3 também silenciaria a regra, mas deixaria 258 cabeçalhos soltos, sem vínculo com o critério a que pertencem, o que pioraria a navegação real. A mudança é uma decisão técnica de marcação e não altera conteúdo validado pela pesquisadora responsável.

O visual foi conferido em `?lang=pt` e `?lang=en`, com a Report expandida: o `<h3>` continua tratado como item flex, como o `<span>` era, e o par ID + nome mantém a mesma quebra em nomes longos.

### 6. Reverificação

Após a correção, `npx tsc --noEmit -p tsconfig.app.json` e `npm run build` rodaram sem erros, e `npm run a11y` passou nas oito cenas com zero violações e exit code 0. A `heading-order` não é mais acusada e nenhuma regra nova apareceu.

### 7. Limites desta auditoria

Zero violações detectáveis pelo axe nas oito cenas cobertas não equivale a conformidade com a WCAG 2.2. Testes automáticos verificam apenas parte dos critérios; o restante exige julgamento humano, como a qualidade dos textos alternativos, a ordem de foco com sentido e a clareza das instruções.

**Acoplamento do script:** o número de perguntas (13) vem do dataset no app (`TOTAL_QUESTIONS`), mas está fixo no loop do `a11y.mjs`. Se o dataset crescer, o app se ajusta sozinho e o script pararia antes do fim ou clicaria a mais.

**Fora da cobertura automática desta rodada:** as perguntas do quiz além da primeira (mesmo componente, mas não analisadas uma a uma); a Report com respostas parciais (layouts com 1 ou 2 grupos POUR, conferidos só visualmente); o build de produção (a auditoria rodou no servidor de desenvolvimento); e o estado de erro ou ausência de `localStorage`.

**Verificações de idioma ainda não feitas** (critérios 3.1.1 e 3.1.2; situação em 30/08/2026; o estado atual está na rodada de 02/10/2026, seção 4). O axe confirma que o atributo `lang` do `<html>` existe e é válido (`html-has-lang`, `html-lang-valid`), mas não que corresponde ao idioma exibido; a correspondência precisa ser conferida nas duas variantes, inclusive no carregamento via `?lang=`. Além disso, na interface em português os nomes dos critérios aparecem com a nomenclatura oficial da W3C em inglês, e o rótulo do seletor aponta para o outro idioma. Sem `lang` nesses trechos, o leitor de tela os lê com a pronúncia do idioma da página (3.1.2, Nível AA). A exceção do 3.1.2 para nomes próprios e termos técnicos pode ou não valer para os nomes dos critérios; é uma decisão de interpretação a registrar. O axe não detecta esse caso.

**Testes manuais:** não há registro de teste manual nesta rodada (30/08); a passada de teclado feita em 02/10 está descrita na rodada seguinte. Não houve teste com leitor de tela. O efeito prático da correção (86 novos h3 no rotor de cabeçalhos do VoiceOver ou NVDA) não foi avaliado, e a verificação em largura estreita, se feita forçando a largura do `body`, não aciona media queries e não é teste de layout responsivo.

---

## Rodada de 02/10/2026: verificação manual de teclado e regressão de idioma

### 1. Motivação

Em 02/10/2026 foi feita uma passada manual de navegação por teclado, em português e em inglês, e ela levou a dois defeitos de i18n que o axe não detecta e que nenhuma rodada anterior cobria. A passada foi rápida e sem roteiro: percorreu com Tab a Intro, o Quiz, o relatório, o Export PDF, os filtros por grupo de usuários e os botões de expandir e recolher todos os detalhes, e não revelou problema de foco. Não foi um teste sistemático dos critérios 2.1.1 (Teclado), 2.4.3 (Ordem do Foco) e 2.4.7 (Foco Visível), a operação de cada `<summary>` individual com Enter e Espaço não foi registrada, e não houve teste com leitor de tela.

### 2. Achados

**Idioma perdido ao iniciar e ao refazer.** `initialState`, em `src/state/quizReducer.ts`, é uma constante de módulo que fixa o resultado de `detectLang()` no momento do import. As ações `START_NEW` e `RESTART` espalham esse objeto e descartam `state.lang`. Sem `?lang=` na URL, trocar para English pelo toggle e clicar em Start abria o quiz em português e devolvia a URL a `?lang=pt`; o mesmo ocorria ao refazer o diagnóstico a partir do relatório. O defeito era invisível nos testes anteriores porque `scripts/a11y.mjs` sempre carrega com `?lang=<idioma>`, o que faz `initialState.lang` coincidir com o idioma pedido. A correção preserva `state.lang` nas duas ações (commit `88b3f08`).

**Rótulos dos nove grupos de usuários só em português.** `Publico.nome` era `string`, fora da migração bilíngue do dataset (commit `6a9b297`), e os rótulos apareciam em português no filtro, no badge "Relevant to" e na persona BDD, misturados à frase em inglês ("As a person with Sem visão, ..."). A correção torna `nome` um `Localized` resolvido na renderização, com o `id` como chave estável (commit `836cd14`). As traduções em inglês são provisórias e estão pendentes de revisão da pesquisadora responsável; duas delas, "Manipulação limitada" e "Alcance e força limitados", dependem de decisão dela, porque os grupos não correspondem um a um às declarações funcionais da cláusula 4.2 do EN 301 549.

### 3. Verificação e seus limites

Foi criado `scripts/i18n-regress.mjs` (`npm run i18n:regress`, 28 asserções em cinco cenários): preservação do idioma em Start, no relatório e em Redo, sem `?lang=` no carregamento e com locale `pt-BR`; troca de idioma no relatório, nos dois sentidos e sem recarregar a página, para os nove rótulos nos três contextos em que aparecem; e varredura de texto visível em português nas quatro cenas em `?lang=en`. Os cenários (a) e (c) foram executados contra o código anterior à correção e falharam (oito asserções); o cenário (b) depende do (a) e não pôde ser exercitado naquela execução, que foi interrompida por tempo limite. Os cenários (d) e (e) foram demonstrados com regressões deliberadas, restauradas em seguida, porque antes da correção os rótulos eram texto simples, sem par pt/en, e a varredura não podia acusá-los; quem acusava os nove rótulos antes da correção era a validação de formato do dataset. A validação de dados (`npm run i18n:validate`) passou a verificar o formato bilíngue dos públicos.

Limites: a varredura compara o texto visível com pares pt/en que existem no dataset e nos dicionários. Um campo escrito apenas em português, sem par, não é detectado por ela; a validação de formato cobre os campos conhecidos, mas um campo novo precisaria ser incluído nela. Conteúdo fixo no código fora dos dicionários também escapa.

### 4. Critérios de idioma

3.1.1 (Nível A): o atributo `lang` do `<html>` foi verificado por asserção nas transições Start, relatório e Redo, em português e em inglês; não foi verificado de forma exaustiva em todos os estados. 3.1.2 (Nível AA) permanece pendente: os nomes oficiais dos critérios da W3C aparecem em inglês na interface em português, e o rótulo do seletor de idioma aponta para o outro idioma, sem marcação de `lang` nesses trechos; o axe não detecta esse caso.

### 5. Pendências

Revisão da pesquisadora responsável sobre as traduções dos nove rótulos e sobre dois problemas de redação nas frases geradas: a inicial maiúscula no meio da frase ("As a person with No vision") e a lista unida por vírgula, que torna ambíguo o item que contém vírgula ("Limited cognition, language or learning"). Ambos já existem em português. Definição de uma marcação de `lang` para os trechos em outro idioma (3.1.2). Avaliação com leitor de tela.

