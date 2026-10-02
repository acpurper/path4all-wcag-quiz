# Diagnóstico de Acessibilidade WCAG 2.2 — Path4All

Quiz interativo que ajuda equipes de produto a identificar critérios WCAG 2.2 aplicáveis ao sistema que estão construindo, na fase de especificação de requisitos.

Aplicação prática do método **Path4All** (Personas + User Stories + BDD + WCAG) — ver [Créditos](#créditos) para autoria e orientação da pesquisa.

## Como funciona

O usuário responde a 13 perguntas sobre características do sistema (tem áudio? tem formulário? tem timeout?) e recebe um relatório com os critérios WCAG 2.2 aplicáveis, organizados por princípio POUR. O relatório permite marcar critérios como implementados, filtrar por público-alvo e exportar como PDF.

## Acessibilidade

A acessibilidade é um requisito do projeto: a interface adota a WCAG 2.2 como referência. Os 11 itens críticos de `docs/auditoria-a11y.md` foram auditados em 28/05/2026 (três telas, em português); desde então, a verificação automatizada com axe-core (`npm run a11y`) cobre oito cenas: Intro, Quiz, relatório fechado e relatório expandido, cada uma em português e em inglês.

A verificação automatizada cobre o que o axe-core consegue detectar e não atesta conformidade com a WCAG 2.2 — consulte `docs/auditoria-a11y.md` para o escopo auditado, os itens verificados manualmente e os limites do método.

## Idiomas

A interface está disponível em português e em inglês. O idioma é alternado pelo seletor no topo da página, sem recarregar, e também pode vir na URL: `?lang=pt` ou `?lang=en` — útil para compartilhar um link já no idioma desejado. A escolha persiste entre visitas e o atributo `lang` do documento acompanha a troca. Na dúvida, vale primeiro o parâmetro da URL; sem ele, o idioma gravado na visita anterior; sem nada gravado, o idioma do navegador; e, em último caso, português.

Os textos de interface ficam nos dicionários tipados em `src/i18n/`; os dados do mapeamento WCAG (categorias, perguntas, princípios, requisitos e públicos) são bilíngues em `data/wcag-mapping.json`. As traduções do dataset para o inglês são provisórias e aguardam revisão pela pesquisadora responsável.

## Stack

- Vite + React + TypeScript + Tailwind CSS
- Persistência via localStorage com fallback gracioso
- Sem dependências de UI (React puro + Tailwind)
- Deploy contínuo via Netlify

## Desenvolvimento

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # gera dist/
npm run a11y           # auditoria axe-core nas oito cenas
npm run i18n:regress   # regressão de idioma nas trocas de tela
npm run i18n:validate  # formato bilíngue do dataset
```

## Estrutura

- `data/wcag-mapping.json` — mapeamento WCAG 2.2 gerado a partir do XLSX da Renata
- `docs/source/WCAG2_2_Mapeamentos.xlsx` — fonte original do mapeamento
- `docs/auditoria-a11y.md` — relatório de auditoria de acessibilidade
- `scripts/a11y.mjs` — script de auditoria automatizada
- `scripts/i18n-regress.mjs` — regressão de idioma nas trocas de tela
- `src/i18n/` — dicionários de interface (pt, en)
- `src/screens/` — três telas (Intro, Quiz, Report)

## Créditos

Ferramenta desenvolvida por **Ana Purper**, bolsista de Iniciação Científica (PIBIC/CNPq), Escola Politécnica — PUCRS.

Baseada no método **Path4All**, pesquisa de mestrado de **Renata Vinadé** (PUCRS), sob orientação da **Profa. Dra. Sabrina Marczak**.
