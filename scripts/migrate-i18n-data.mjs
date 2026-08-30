// Script de execução única — migra data/wcag-mapping.json do shape antigo
// (campos string em pt) para o shape bilíngue { pt, en }, usando as traduções
// já preparadas em docs/source/wcag-translations-en.json. Não integrado ao
// build; roda uma vez e o resultado fica commitado.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const mappingPath = path.join(root, 'data/wcag-mapping.json');
const translationsPath = path.join(root, 'docs/source/wcag-translations-en.json');

const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));
const translations = JSON.parse(readFileSync(translationsPath, 'utf-8'));

const byCriterioId = new Map(translations.map((t) => [t.criterio, t]));

function translationFor(criterioId) {
  const t = byCriterioId.get(criterioId);
  if (!t) {
    throw new Error(`Nenhuma tradução encontrada para o critério ${criterioId}`);
  }
  return t;
}

for (const categoria of mapping.categorias) {
  const primeiroCriterio = categoria.criterios[0];
  if (!primeiroCriterio) {
    throw new Error(`Categoria ${categoria.id} não tem critérios`);
  }
  const t = translationFor(primeiroCriterio.id);

  categoria.nome = { pt: t.tipo.pt, en: t.tipo.en };
  categoria.principio = { pt: t.principio.pt, en: t.principio.en };
  categoria.pergunta = { pt: t.pergunta.pt, en: t.pergunta.en };

  for (const criterio of categoria.criterios) {
    const ct = translationFor(criterio.id);
    criterio.obrigatoriedade = { pt: ct.obrigatoriedade.pt, en: ct.obrigatoriedade.en };
    criterio.requisito = { pt: ct.requisito.pt, en: ct.requisito.en };
  }
}

writeFileSync(mappingPath, `${JSON.stringify(mapping, null, 2)}\n`, 'utf-8');
console.log('Migração concluída:', mappingPath);
