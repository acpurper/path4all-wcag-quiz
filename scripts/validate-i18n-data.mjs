// Valida data/wcag-mapping.json após a migração feita por migrate-i18n-data.mjs.
// Sai com código != 0 se qualquer checagem falhar.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const mappingPath = path.join(root, 'data/wcag-mapping.json');

const errors = [];

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isBilingual(v) {
  return (
    v !== null &&
    typeof v === 'object' &&
    !Array.isArray(v) &&
    isNonEmptyString(v.pt) &&
    isNonEmptyString(v.en)
  );
}

const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));
const categorias = mapping.categorias ?? [];

if (categorias.length !== 13) {
  errors.push(`Esperava 13 categorias, encontrou ${categorias.length}`);
}

const criterioIds = [];
for (const categoria of categorias) {
  for (const criterio of categoria.criterios ?? []) {
    criterioIds.push(criterio.id);
  }
}

if (criterioIds.length !== 86) {
  errors.push(`Esperava 86 critérios no total, encontrou ${criterioIds.length}`);
}

const idCounts = new Map();
for (const id of criterioIds) {
  idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
}
for (const [id, count] of idCounts) {
  if (count > 1) {
    errors.push(`Critério ${id} duplicado (${count}x) no arquivo novo`);
  }
}

let oldIds = [];
try {
  const oldRaw = execFileSync('git', ['show', 'HEAD:data/wcag-mapping.json'], {
    cwd: root,
    encoding: 'utf-8',
  });
  const oldMapping = JSON.parse(oldRaw);
  for (const categoria of oldMapping.categorias ?? []) {
    for (const criterio of categoria.criterios ?? []) {
      oldIds.push(criterio.id);
    }
  }
} catch (err) {
  errors.push(`Não foi possível ler data/wcag-mapping.json de HEAD via git show: ${err.message}`);
}

const newIdSet = new Set(criterioIds);
for (const id of oldIds) {
  if (!newIdSet.has(id)) {
    errors.push(`Critério ${id} do arquivo antigo não existe no arquivo novo`);
  }
}

for (const categoria of categorias) {
  if (!isBilingual(categoria.nome)) {
    errors.push(`Categoria ${categoria.id}: nome não é { pt, en } com ambos preenchidos`);
  }
  if (!isBilingual(categoria.principio)) {
    errors.push(`Categoria ${categoria.id}: principio não é { pt, en } com ambos preenchidos`);
  }
  if (!isBilingual(categoria.pergunta)) {
    errors.push(`Categoria ${categoria.id}: pergunta não é { pt, en } com ambos preenchidos`);
  }

  for (const criterio of categoria.criterios ?? []) {
    if (!isBilingual(criterio.obrigatoriedade)) {
      errors.push(`Critério ${criterio.id}: obrigatoriedade não é { pt, en } com ambos preenchidos`);
    }
    if (!isBilingual(criterio.requisito)) {
      errors.push(`Critério ${criterio.id}: requisito não é { pt, en } com ambos preenchidos`);
    }
    if (!isNonEmptyString(criterio.nome)) {
      errors.push(`Critério ${criterio.id}: nome deveria continuar string não vazia, encontrou ${JSON.stringify(criterio.nome)}`);
    }
  }
}

const publicos = mapping.publicos ?? [];

if (publicos.length !== 9) {
  errors.push(`Esperava 9 públicos, encontrou ${publicos.length}`);
}

for (const publico of publicos) {
  if (!isNonEmptyString(publico.id)) {
    errors.push(`Público sem id válido: ${JSON.stringify(publico)}`);
  }
  if (!isBilingual(publico.nome)) {
    errors.push(
      `Público ${publico.id}: nome não é { pt, en } com ambos preenchidos, encontrou ${JSON.stringify(publico.nome)}`,
    );
  }
}

if (errors.length > 0) {
  console.error(`Validação falhou com ${errors.length} erro(s):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}

console.log('Validação ok: 13 categorias, 86 critérios, 9 públicos, shape bilíngue consistente.');
