# Diagnóstico de Acessibilidade WCAG 2.2 — Path4All

Quiz interativo que ajuda equipes de produto a identificar critérios WCAG 2.2 aplicáveis ao sistema que estão construindo, na fase de especificação de requisitos.

Aplicação prática do método **Path4All** (Personas + User Stories + BDD + WCAG) — ver [Créditos](#créditos) para autoria e orientação da pesquisa.

## Como funciona

O usuário responde a 13 perguntas sobre características do sistema (tem áudio? tem formulário? tem timeout?) e recebe um relatório com os critérios WCAG 2.2 aplicáveis, organizados por princípio POUR. O relatório permite marcar critérios como implementados, filtrar por público-alvo e exportar como PDF.

## Acessibilidade

O próprio site é exemplo de acessibilidade. Auditado contra os 11 itens críticos definidos em `docs/auditoria-a11y.md` e validado automaticamente via axe-core (`npm run a11y`). Zero violations em todas as telas.

## Stack

- Vite + React + TypeScript + Tailwind CSS
- Persistência via localStorage com fallback gracioso
- Sem dependências de UI (React puro + Tailwind)
- Deploy contínuo via Netlify

## Desenvolvimento

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
npm run a11y      # auditoria axe-core (dev server precisa estar rodando)
```

## Estrutura

- `data/wcag-mapping.json` — mapeamento WCAG 2.2 gerado a partir do XLSX da Renata
- `docs/source/WCAG2_2_Mapeamentos.xlsx` — fonte original do mapeamento
- `docs/auditoria-a11y.md` — relatório de auditoria de acessibilidade
- `scripts/a11y.mjs` — script de auditoria automatizada
- `src/screens/` — três telas (Intro, Quiz, Report)

## Créditos

Ferramenta desenvolvida por **Ana Purper**, bolsista de Iniciação Científica (PIBIC/CNPq), Escola Politécnica — PUCRS.

Baseada no método **Path4All**, pesquisa de mestrado de **Renata Vinadé** (PUCRS), sob orientação da **Profa. Dra. Sabrina Marczak**.
