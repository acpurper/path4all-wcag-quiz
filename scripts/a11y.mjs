import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const BASE = 'http://localhost:5173';

// Seletores derivados dos valores reais em src/i18n/pt.ts e src/i18n/en.ts —
// ver relatório da Fase 5 para a string de origem de cada regex.
const SELECTORS = {
  pt: {
    comecar: /^Começar$/i,
    sim: /^Sim/i,
    relatorio: /Critérios de sucesso/i,
    expandir: /expandir/i,
  },
  en: {
    comecar: /^Start$/i,
    sim: /^Yes/i,
    relatorio: /Success Criteria/i,
    expandir: /expand/i,
  },
};

async function auditar(page, nome) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  if (violations.length === 0) {
    console.log(`[${nome}] ✓ zero violations`);
    return 0;
  }
  console.log(`[${nome}] ✗ ${violations.length} violations:`);
  for (const v of violations) {
    console.log(`  - ${v.id} (${v.impact}): ${v.help}`);
    console.log(`    ${v.helpUrl}`);
    for (const n of v.nodes) {
      console.log(`    target: ${n.target.join(', ')}`);
      console.log(`    html: ${n.html.slice(0, 120)}`);
    }
  }
  return violations.length;
}

const browser = await chromium.launch();
let total = 0;

for (const locale of ['pt', 'en']) {
  const SEL = SELECTORS[locale];
  const START_URL = `${BASE}/?lang=${locale}`;

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(START_URL);
  await page.evaluate(() => localStorage.clear());
  // goto (não reload) para garantir que ?lang= permaneça na URL de forma
  // determinística, sem depender do momento em que o replaceState do app roda.
  await page.goto(START_URL);

  total += await auditar(page, `IntroScreen:${locale}`);

  await page.getByRole('button', { name: SEL.comecar }).click();
  // QuizScreen é a única tela com role=progressbar — espera determinística
  // de que a navegação realmente ocorreu, sem depender de texto por locale.
  await page.getByRole('progressbar').waitFor();
  total += await auditar(page, `QuizScreen-Q1:${locale}`);

  for (let i = 0; i < 13; i++) {
    const isLast = i === 12;
    const prevValue = await page.getAttribute('[role="progressbar"]', 'aria-valuenow');
    await page.getByRole('button', { name: SEL.sim }).first().click();
    if (isLast) {
      // Última resposta troca de tela (quiz -> report); o progressbar
      // desmonta, então a âncora passa a ser o heading do relatório.
      await page.getByRole('heading', { name: SEL.relatorio }).waitFor();
    } else {
      await page.waitForFunction(
        (prev) =>
          document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow') !== prev,
        prevValue,
      );
    }
  }

  total += await auditar(page, `ReportScreen:${locale}`);

  await page.getByRole('button', { name: SEL.expandir }).click();
  await page.waitForFunction(() => {
    const all = document.querySelectorAll('details');
    const open = document.querySelectorAll('details[open]');
    return all.length > 0 && all.length === open.length;
  });
  total += await auditar(page, `ReportScreen-expandido:${locale}`);

  await context.close();
}

await browser.close();
process.exit(total === 0 ? 0 : 1);
