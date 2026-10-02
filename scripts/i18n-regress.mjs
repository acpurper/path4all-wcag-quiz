// Regressão de idioma na troca de telas.
//
// Nenhum cenário carrega a página com ?lang= — o parâmetro na URL faz
// initialState.lang coincidir com o idioma escolhido e mascara qualquer reset
// em START_NEW/RESTART. O idioma aqui é sempre escolhido pelo toggle, e o
// contexto usa locale pt-BR para que o fallback de navigator.language seja 'pt'
// e qualquer perda de idioma apareça como texto em português.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import rawData from '../data/wcag-mapping.json' with { type: 'json' };

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const BASE = 'http://localhost:5173';

// Pergunta 1 vem do dataset; os demais rótulos espelham src/i18n/{pt,en}.ts.
const Q1_EN = rawData.categorias[0].pergunta.en;
const Q1_PT = rawData.categorias[0].pergunta.pt;
const INTRO_H1_EN = 'WCAG 2.2 Accessibility Diagnostic';
const REPORT_H1_EN = 'Applicable WCAG 2.2 Success Criteria';
const BTN_START_PT = /^Começar$/i;
const BTN_YES_PT = /^Sim/i;
const BTN_REDO_EN = 'Redo diagnostic';

let failures = 0;
// ---------------------------------------------------------------------------
// Vazamento de idioma: nenhum valor .pt deve aparecer na interface em inglês.
//
// A comparação é de string exata contra os pares (pt, en) do dataset e dos
// dicionários, e só considera pares em que pt !== en — valores idênticos nos
// dois idiomas (nomes próprios, siglas) não são vazamento por definição.
// ---------------------------------------------------------------------------

// Strings que podem aparecer em português na interface em inglês por serem
// nomes próprios ou marcas. Mantida curta e explícita de propósito.
const ALLOWLIST = new Set([
  'Renata Vinadé',
  'Ana Purper',
  'Sabrina Marczak',
  'Path4All',
]);

function dictPairs() {
  // Captura `chave: 'valor'` (literal podendo estar na linha seguinte) nos dois
  // dicionários e cruza por nome de chave. Template literals e funções ficam de
  // fora: não são strings fixas comparáveis.
  const re = /(\w+):\s*(?:\n\s*)?('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g;
  const read = (file) => {
    const src = readFileSync(path.join(ROOT, 'src/i18n', file), 'utf-8');
    const out = new Map();
    for (const m of src.matchAll(re)) {
      const lit = m[2];
      const body = lit.slice(1, -1).replace(/\\(['"\\])/g, '$1');
      out.set(m[1], body);
    }
    return out;
  };
  const ptMap = read('pt.ts');
  const enMap = read('en.ts');
  const pairs = [];
  for (const [k, ptv] of ptMap) {
    const env = enMap.get(k);
    if (typeof env === 'string') pairs.push({ pt: ptv, en: env, origem: `pt.ts:${k}` });
  }
  return pairs;
}

function datasetPairs() {
  const pairs = [];
  (function walk(node, trilha) {
    if (!node || typeof node !== 'object') return;
    if (typeof node.pt === 'string' && typeof node.en === 'string') {
      pairs.push({ pt: node.pt, en: node.en, origem: `dataset:${trilha}` });
    }
    for (const [k, v] of Object.entries(node)) walk(v, `${trilha}.${k}`);
  })(rawData, 'wcag-mapping');
  return pairs;
}

function leakIndex() {
  const index = new Map();
  for (const pair of [...datasetPairs(), ...dictPairs()]) {
    if (pair.pt === pair.en) continue;
    if (ALLOWLIST.has(pair.pt)) continue;
    if (!index.has(pair.pt)) index.set(pair.pt, pair);
  }
  return index;
}

async function visibleText(page) {
  return page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const texto = node.textContent.trim();
      if (!texto) continue;
      const el = node.parentElement;
      if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      out.push(texto);
    }
    return out;
  });
}

async function checkLeaks(page, cena, index) {
  const textos = await visibleText(page);
  const achados = [...new Set(textos.filter((t) => index.has(t)))];
  if (achados.length === 0) {
    console.log(`    ✓ ${cena}: nenhum texto em português (${textos.length} nós visíveis)`);
    return;
  }
  console.log(`    ✗ ${cena}: ${achados.length} string(s) em português`);
  for (const a of achados) {
    const pair = index.get(a);
    console.log(`        "${a}"`);
    console.log(`           esperado em inglês: "${pair.en}"   [${pair.origem}]`);
    failures++;
  }
}


function check(label, actual, expected) {
  const ok = expected instanceof RegExp ? expected.test(actual) : actual === expected;
  console.log(`    ${ok ? '✓' : '✗'} ${label}`);
  if (!ok) {
    console.log(`        esperado: ${expected}`);
    console.log(`        obtido  : ${actual}`);
    failures++;
  }
}

// Um cenário que falha não deve interromper os seguintes: o erro é contabilizado
// como falha e a execução segue para o próximo bloco.
async function scenario(label, fn) {
  try {
    await fn();
  } catch (err) {
    console.log(`    ✗ ${label} interrompido: ${err.name}: ${String(err.message).split('\n')[0]}`);
    failures++;
  }
}

async function probe(page) {
  return page.evaluate(() => ({
    url: location.href,
    htmlLang: document.documentElement.lang,
    h1: document.querySelector('main h1')?.textContent?.trim() ?? '',
  }));
}

async function answerAll(page, yesLabel) {
  for (let i = 0; i < rawData.categorias.length; i++) {
    const isLast = i === rawData.categorias.length - 1;
    const prev = await page.getAttribute('[role="progressbar"]', 'aria-valuenow');
    await page.getByRole('button', { name: yesLabel }).first().click();
    if (isLast) {
      await page.waitForFunction(() => !document.querySelector('[role="progressbar"]'));
    } else {
      await page.waitForFunction(
        (p) =>
          document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow') !== p,
        prev,
      );
    }
  }
}

const browser = await chromium.launch();

// ---- (a) e (b): toggle para English na intro, depois Start e as 13 respostas ----
await scenario('(a)/(b)', async () => {
  const context = await browser.newContext({ locale: 'pt-BR' });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE);

  await page.getByRole('button', { name: 'English' }).click();
  await page.waitForFunction(() => document.documentElement.lang === 'en');

  await page.getByRole('button', { name: /^Start$/i }).click();
  await page.getByRole('progressbar').waitFor();

  console.log('(a) START_NEW preserva o idioma escolhido pelo toggle');
  let p = await probe(page);
  check('pergunta 1 em inglês', p.h1, Q1_EN);
  check('pergunta 1 não está em português', String(p.h1 !== Q1_PT), 'true');
  check('URL com ?lang=en', p.url, /[?&]lang=en(&|$)/);
  check('html lang=en', p.htmlLang, 'en');

  await answerAll(page, /^Yes/i);

  console.log('(b) o relatório permanece em inglês');
  p = await probe(page);
  check('h1 do relatório em inglês', p.h1, REPORT_H1_EN);
  check('URL com ?lang=en', p.url, /[?&]lang=en(&|$)/);
  check('html lang=en', p.htmlLang, 'en');

  await context.close();
});

// ---- (c): RESTART a partir do relatório, com idioma trocado para English ----
await scenario('(c)', async () => {
  const context = await browser.newContext({ locale: 'pt-BR' });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE);

  await page.getByRole('button', { name: BTN_START_PT }).click();
  await page.getByRole('progressbar').waitFor();
  await answerAll(page, BTN_YES_PT);

  await page.getByRole('button', { name: 'English' }).click();
  await page.waitForFunction(() => document.documentElement.lang === 'en');

  await page.getByRole('button', { name: BTN_REDO_EN }).click();
  await page.waitForFunction((h1) => document.querySelector('main h1')?.textContent?.trim() !== h1, REPORT_H1_EN);

  console.log('(c) RESTART preserva o idioma escolhido pelo toggle');
  const p = await probe(page);
  check('intro em inglês', p.h1, INTRO_H1_EN);
  check('URL com ?lang=en', p.url, /[?&]lang=en(&|$)/);
  check('html lang=en', p.htmlLang, 'en');

  await context.close();
});

// ---- (d): nenhum valor .pt visível nas 4 cenas em ?lang=en ----
await scenario('(d)', async () => {
  const index = leakIndex();
  console.log(`(d) sem vazamento de português em ?lang=en  [${index.size} pares pt/en distintos; allowlist: ${[...ALLOWLIST].join(', ')}]`);

  const context = await browser.newContext({ locale: 'pt-BR' });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);

  await page.goto(`${BASE}/?lang=en`);
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE}/?lang=en`);
  await checkLeaks(page, 'IntroScreen:en', index);

  await page.getByRole('button', { name: /^Start$/i }).click();
  await page.getByRole('progressbar').waitFor();
  await checkLeaks(page, 'QuizScreen-Q1:en', index);

  await answerAll(page, /^Yes/i);
  await checkLeaks(page, 'ReportScreen:en', index);

  await page.getByRole('button', { name: /expand/i }).click();
  await page.waitForFunction(() => {
    const todos = document.querySelectorAll('details');
    const abertos = document.querySelectorAll('details[open]');
    return todos.length > 0 && todos.length === abertos.length;
  });
  await checkLeaks(page, 'ReportScreen-expandido:en', index);

  await context.close();
});

// ---- (e): troca de idioma no relatório atualiza os 9 rótulos sem recarregar ----
await scenario('(e)', async () => {
  console.log('(e) os 9 rótulos de público acompanham a troca de idioma no relatório');

  const esperado = {
    pt: rawData.publicos.map((p) => p.nome.pt),
    en: rawData.publicos.map((p) => p.nome.en),
  };

  const context = await browser.newContext({ locale: 'pt-BR' });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);

  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE);

  await page.getByRole('button', { name: BTN_START_PT }).click();
  await page.getByRole('progressbar').waitFor();
  await answerAll(page, BTN_YES_PT);

  // Um público ativo faz o badge aparecer; details abertos expõem a persona.
  await page.locator(`#pub-${rawData.publicos[0].id}`).check();
  await page.getByRole('button', { name: /expandir/i }).click();
  await page.waitForFunction(() => {
    const todos = document.querySelectorAll('details');
    const abertos = document.querySelectorAll('details[open]');
    return todos.length > 0 && todos.length === abertos.length;
  });

  // Sentinela: some num reload, então prova que a troca foi em memória.
  await page.evaluate(() => {
    window.__semReload = true;
  });

  const ler = async () =>
    page.evaluate(() => {
      const textos = [...document.querySelectorAll('main, header')]
        .map((e) => e.innerText)
        .join('\n');
      return {
        checkboxes: [...document.querySelectorAll('label[for^=pub-]')].map((l) =>
          l.textContent.trim(),
        ),
        badge:
          [...document.querySelectorAll('main *')]
            .map((e) => e.textContent?.trim())
            .find((t) => t && /^(Relevant to:|Relevante para:)/.test(t) && t.length < 300) ?? '',
        persona:
          [...document.querySelectorAll('main *')]
            .map((e) => e.textContent?.trim())
            .find(
              (t) => t && /^(As a user \(|Como pessoa usuária \()/.test(t) && t.length < 300,
            ) ?? '',
        textoTodo: textos,
        semReload: window.__semReload === true,
      };
    });

  const conferir = (idioma, outro, visao) => {
    const rotulo = esperado[idioma][0];
    const rotuloOutro = esperado[outro][0];
    check(`checkboxes em ${idioma}`, JSON.stringify(visao.checkboxes), JSON.stringify(esperado[idioma]));
    check(`badge contém "${rotulo}"`, String(visao.badge.includes(rotulo)), 'true');
    check(`persona contém "${rotulo}"`, String(visao.persona.includes(rotulo)), 'true');
    check(
      `nenhum rótulo de ${outro} na tela (ex. "${rotuloOutro}")`,
      String(esperado[outro].every((r) => !visao.textoTodo.includes(r))),
      'true',
    );
  };

  conferir('pt', 'en', await ler());

  await page.getByRole('button', { name: 'English' }).click();
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  const depoisEn = await ler();
  check('troca para English sem recarregar a página', String(depoisEn.semReload), 'true');
  conferir('en', 'pt', depoisEn);

  await page.getByRole('button', { name: 'Português' }).click();
  await page.waitForFunction(() => document.documentElement.lang === 'pt-BR');
  const voltaPt = await ler();
  check('volta para Português sem recarregar a página', String(voltaPt.semReload), 'true');
  conferir('pt', 'en', voltaPt);

  await context.close();
});

// ---- (f): rótulos de público como valores na persona, separados por "; " ----
await scenario('(f)', async () => {
  console.log('(f) persona não concatena o rótulo como complemento e separa a lista por "; "');

  // Padrão que acusa a redação antiga ("... person with Blind", "... pessoa com Sem visão").
  const GRUDADO_SRC = '(person with|pessoa com)\\s+(Blind|Deaf|Low vision|Sem |No |Limited|Hard)';
  const PREFIXO = { pt: /^Como pessoa usuária \(/, en: /^As a user \(/ };
  const CRIT = '1.2.2';
  // Seletores por idioma, derivados dos rótulos reais dos dicionários.
  const BOTOES = {
    pt: { comecar: BTN_START_PT, sim: BTN_YES_PT, expandir: /expandir/i },
    en: { comecar: /^Start$/i, sim: /^Yes/i, expandir: /expand/i },
  };

  for (const locale of ['pt', 'en']) {
    const SEL = BOTOES[locale];
    const context = await browser.newContext({ locale: 'pt-BR' });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);

    await page.goto(`${BASE}/?lang=${locale}`);
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/?lang=${locale}`);
    await page.getByRole('button', { name: SEL.comecar }).click();
    await page.getByRole('progressbar').waitFor();
    await answerAll(page, SEL.sim);
    await page.getByRole('button', { name: SEL.expandir }).click();
    await page.waitForFunction(() => {
      const todos = document.querySelectorAll('details');
      const abertos = document.querySelectorAll('details[open]');
      return todos.length > 0 && todos.length === abertos.length;
    });

    // (i) nenhuma persona renderizada usa o rótulo como complemento da preposição
    const personas = await page.evaluate(
      (pre) =>
        [...new Set(
          [...document.querySelectorAll('main *')]
            .map((e) => e.textContent?.trim())
            .filter((t) => t && new RegExp(pre).test(t) && t.length < 400),
        )],
      PREFIXO[locale].source,
    );
    check(`[${locale}] personas renderizadas encontradas`, String(personas.length > 0), 'true');
    // A varredura é sobre TODO o texto do relatório, não só sobre o que casa com
    // o prefixo novo: se o template voltar ao antigo, o prefixo deixa de casar e
    // uma checagem restrita às personas encontradas ficaria vazia — e verde.
    const textoRelatorio = await page.evaluate(() => document.querySelector('main').innerText);
    const grudado = textoRelatorio.match(new RegExp(GRUDADO_SRC));
    check(
      `[${locale}] nenhum rótulo grudado na preposição em todo o relatório`,
      grudado ? JSON.stringify(grudado[0]) : 'nenhum',
      'nenhum',
    );

    // (ii) a persona do 1.2.2 traz os 3 rótulos do dataset, separados por "; "
    const esperados = rawData.categorias
      .flatMap((c) => c.criterios)
      .find((k) => k.id === CRIT)
      .publicos_atendidos.map(
        (id) => rawData.publicos.find((p) => p.id === id).nome[locale],
      );
    check(`[${locale}] ${CRIT} tem 3 públicos no dataset`, String(esperados.length), '3');

    const alvo = await page.evaluate(
      ({ cid, pre }) => {
        const li = [...document.querySelectorAll('li.criterio')].find((e) =>
          e.textContent.trim().startsWith(cid),
        );
        if (!li) return null;
        return (
          [...li.querySelectorAll('*')]
            .map((e) => e.textContent?.trim())
            .find((t) => t && new RegExp(pre).test(t) && t.length < 400) ?? null
        );
      },
      { cid: CRIT, pre: PREFIXO[locale].source },
    );
    check(`[${locale}] persona do ${CRIT} renderizada`, String(alvo !== null), 'true');

    const lista = alvo?.match(/\(([^)]*)\)/)?.[1] ?? '';
    check(`[${locale}] lista do ${CRIT} separada por "; "`, lista, esperados.join('; '));
    check(
      `[${locale}] sem vírgula entre o 1o e o 2o rótulo do ${CRIT}`,
      String(!lista.startsWith(`${esperados[0]},`)),
      'true',
    );

    await context.close();
  }
});

await browser.close();
console.log(failures === 0 ? '\n✓ idioma preservado nas transições e sem vazamento em inglês' : `\n✗ ${failures} asserção(ões) falharam`);
process.exit(failures === 0 ? 0 : 1);
