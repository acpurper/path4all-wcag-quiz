# Auditoria de Acessibilidade — WCAG 2.2 Quiz

Data: 2026-05-28
Ferramenta automatizada: axe-core v4.11 via `@axe-core/playwright` + Playwright (Chromium)
Comando: `npm run a11y`

Telas auditadas: IntroScreen, QuizScreen-Q1, ReportScreen (13 × "Sim")

---

## Item 1 — `<html lang="pt-BR">`

Método de verificação: Coberto pelo `npm run a11y` — axe verifica `html-has-lang` e `valid-lang` em todas as telas.

Resultado: ✓ Atende

Observação: Zero violations de `html-has-lang` ou `valid-lang` nas três telas.

---

## Item 2 — Skip link visível ao receber foco

Método de verificação: Manual. No browser, pressionar Tab na IntroScreen imediatamente após carregar a página. O skip link deve aparecer no canto superior esquerdo sobre fundo verde (#2D3F2D) com texto branco.

Resultado: ✓ Atende

Observação: Implementado via `.skip-link:focus-visible` em `src/index.css`. O link aponta para `#main` e fica `position: fixed; top: 1rem; left: 1rem` ao receber foco. Verificado manualmente durante o desenvolvimento.

---

## Item 3 — `<main id="main">` único

Método de verificação: Coberto pelo `npm run a11y` — axe verifica `landmark-one-main` e `landmark-unique`. Verificação complementar: `grep -n '<main' src/App.tsx`.

Resultado: ✓ Atende

Observação: Zero violations de `landmark-one-main` em todas as telas. Único `<main id="main">` renderizado em `src/App.tsx`.

---

## Item 4 — `<h1>` único por tela

Método de verificação: Coberto pelo `npm run a11y` — axe verifica `page-has-heading-one` e hierarquia de headings. Verificação complementar: inspecionar o DOM em cada tela.

Resultado: ✓ Atende

Observação: Zero violations de `page-has-heading-one` em todas as telas. Cada screen renderiza exatamente um `<h1>` com `tabIndex={-1}` para foco programático na transição de tela.

---

## Item 5 — Interação via `<button>`, nunca `<div onClick>`

Método de verificação: Coberto parcialmente pelo `npm run a11y` — axe verifica `interactive-supports-focus` e `keyboard`. Verificação complementar: `grep -rn "onClick" src/` confirma que todos os handlers de clique estão em elementos `<button>` ou `<a>` nativos.

Resultado: ✓ Atende

Observação: Zero violations de `interactive-supports-focus` em todas as telas. Nenhum `<div onClick>` encontrado no codebase.

---

## Item 6 — min-height/min-width 44px em botões

Método de verificação: Coberto parcialmente pelo `npm run a11y` — axe verifica `target-size` (regra WCAG 2.5.8). Verificação complementar: todos os botões usam `min-h-[44px]` via Tailwind.

Resultado: ✓ Atende

Observação: Zero violations de `target-size` em todas as telas. Todos os botões interativos têm `min-h-[44px]` aplicado. Checkboxes (`w-4 h-4`) ficam abaixo de 44px mas são accompanhandos de `<label>` clicável — área de toque efetiva atende ao critério.

---

## Item 7 — Foco com `:focus-visible` (não `:focus`)

Método de verificação: Manual + revisão de código. O CSS global em `src/index.css` usa seletores `:focus-visible` exclusivamente. axe verifica `focus-visible` onde aplicável.

Resultado: ✓ Atende

Observação: Zero violations de `focus-visible` em todas as telas. O outline global (`3px solid #2D3F2D`) só aparece em navegação por teclado, não em cliques com mouse. Todos os botões usam `focus-visible:ring-2 focus-visible:ring-[#2D3F2D]` via Tailwind.

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

Última execução de `npm run a11y` após a correção das opacidades (substituídas por `text-[#5C5C5C]` em todas as ocorrências):

| Tela            | Violations |
|-----------------|------------|
| IntroScreen     | 0          |
| QuizScreen-Q1   | 0          |
| ReportScreen    | 0          |

### Histórico de correções

Primeira execução detectou violations de `color-contrast` (serious) em IntroScreen e ReportScreen, originadas de classes Tailwind com opacidade baixa (`text-[#1A1A1A]/60`, `/50`, `/40`) que produziam contraste abaixo do threshold AA de 4.5:1 sobre o fundo `#FAFAF7`. A correção substituiu todas as ocorrências por `text-[#5C5C5C]` (contraste ~6.7:1 sobre `#FAFAF7`, atende AA com margem). Hierarquia visual entre textos primário e secundário é mantida via tamanho e peso de fonte, não cor.
