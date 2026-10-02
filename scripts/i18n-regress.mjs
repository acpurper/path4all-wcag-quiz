// Regressão de idioma na troca de telas.
//
// Nenhum cenário carrega a página com ?lang= — o parâmetro na URL faz
// initialState.lang coincidir com o idioma escolhido e mascara qualquer reset
// em START_NEW/RESTART. O idioma aqui é sempre escolhido pelo toggle, e o
// contexto usa locale pt-BR para que o fallback de navigator.language seja 'pt'
// e qualquer perda de idioma apareça como texto em português.
import { chromium } from 'playwright';
import rawData from '../data/wcag-mapping.json' with { type: 'json' };

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

await browser.close();
console.log(failures === 0 ? '\n✓ idioma preservado em todas as transições' : `\n✗ ${failures} asserção(ões) falharam`);
process.exit(failures === 0 ? 0 : 1);
