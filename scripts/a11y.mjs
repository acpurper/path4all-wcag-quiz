import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const BASE = 'http://localhost:5173';

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
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(BASE);
await page.evaluate(() => localStorage.clear());
await page.reload();

let total = 0;
total += await auditar(page, 'IntroScreen');

await page.getByRole('button', { name: /começar/i }).click();
await page.waitForSelector('main h1');
total += await auditar(page, 'QuizScreen-Q1');

for (let i = 0; i < 13; i++) {
  await page.getByRole('button', { name: /^Sim/i }).first().click();
  await page.waitForTimeout(120);
}
await page.waitForSelector('main h1', { hasText: /relatório/i });
total += await auditar(page, 'ReportScreen');

await context.close();
await browser.close();
process.exit(total === 0 ? 0 : 1);
