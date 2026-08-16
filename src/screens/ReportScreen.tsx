import type { State, Criterio } from '../types/wcag';
import type { Dict } from '../i18n/index';
import { categorias, publicos, deveDestacar } from '../lib/wcag';

interface Props {
  t: Dict;
  state: State;
  dispatch: (action: import('../types/wcag').Action) => void;
}

const POUR_ORDER = ['Perceptível', 'Operável', 'Compreensível', 'Robusto'] as const;

// Built once at module level — publicos array is static
const publicoNomeMap = new Map(publicos.map((p) => [p.id, p.nome]));

export function ReportScreen({ t, state, dispatch }: Props) {
  const { answers, implementado, publicosAtivos } = state;

  const applicableCategories = categorias.filter(
    (cat) => answers[cat.id] === 'sim' || answers[cat.id] === 'nao_sei',
  );

  const byPrinciple: Partial<Record<string, Criterio[]>> = {};
  for (const cat of applicableCategories) {
    for (const criterio of cat.criterios) {
      const existing = byPrinciple[cat.principio];
      if (existing) {
        existing.push(criterio);
      } else {
        byPrinciple[cat.principio] = [criterio];
      }
    }
  }

  const allCriterios = applicableCategories.flatMap((cat) => cat.criterios);
  const totalObrigatorio = allCriterios.filter(
    (c) => c.obrigatoriedade === 'Obrigatório',
  ).length;
  const totalRecomendavel = allCriterios.filter(
    (c) => c.obrigatoriedade === 'Recomendável',
  ).length;
  const obrigatoriosImplementados = allCriterios.filter(
    (c) => c.obrigatoriedade === 'Obrigatório' && implementado[c.id],
  ).length;

  function expandirTodos() {
    document.querySelectorAll<HTMLDetailsElement>('details').forEach((d) => {
      d.open = true;
    });
  }

  function recolherTodos() {
    document.querySelectorAll<HTMLDetailsElement>('details').forEach((d) => {
      d.open = false;
    });
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-2xl w-full mx-auto">
        <h1
          tabIndex={-1}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          className="text-4xl sm:text-5xl font-medium text-[#2D3F2D] mb-8 leading-tight"
        >
          {t.report.heading}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Stat t={t} label={t.report.statCategorias} value={applicableCategories.length} />
          <Stat t={t} label={t.report.statObrigatorios} value={totalObrigatorio} />
          <Stat t={t} label={t.report.statRecomendaveis} value={totalRecomendavel} />
          <Stat
            t={t}
            label={t.report.statImplementados}
            value={`${obrigatoriosImplementados} / ${totalObrigatorio}`}
          />
        </div>

        {/* Action bar — hidden on print via .action-bar class */}
        <div className="action-bar flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => window.print()}
            className="min-h-[44px] px-5 py-2 bg-[#2D3F2D] text-white rounded text-sm font-medium hover:bg-[#3a5230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
          >
            {t.report.btnExportarPdf}
          </button>
          <button
            onClick={() => dispatch({ type: 'RESTART' })}
            className="min-h-[44px] px-5 py-2 border-2 border-[#2D3F2D] text-[#2D3F2D] rounded text-sm font-medium hover:bg-[#2D3F2D]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
          >
            {t.report.btnRefazer}
          </button>
          <button
            onClick={expandirTodos}
            className="min-h-[44px] px-5 py-2 border border-[#1A1A1A]/20 text-[#5C5C5C] rounded text-sm font-medium hover:border-[#1A1A1A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
          >
            {t.report.btnExpandir}
          </button>
          <button
            onClick={recolherTodos}
            className="min-h-[44px] px-5 py-2 border border-[#1A1A1A]/20 text-[#5C5C5C] rounded text-sm font-medium hover:border-[#1A1A1A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
          >
            {t.report.btnRecolher}
          </button>
        </div>

        {/* Filter by público — fieldset with legend, checkboxes, clear button */}
        <fieldset className="mb-10 border border-[#1A1A1A]/10 rounded p-5">
          <legend
            className="text-sm font-semibold text-[#1A1A1A] px-2"
          >
            {t.report.fieldsetLegend}
          </legend>
          <p className="text-xs text-[#5C5C5C] mb-4 leading-relaxed">
            {t.report.fieldsetDesc}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mb-4">
            {publicos.map((publico) => (
              <div key={publico.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`pub-${publico.id}`}
                  checked={publicosAtivos.includes(publico.id)}
                  onChange={() =>
                    dispatch({ type: 'TOGGLE_PUBLICO', publicoId: publico.id })
                  }
                  className="w-4 h-4 accent-[#2D3F2D] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-1 rounded"
                />
                <label
                  htmlFor={`pub-${publico.id}`}
                  className="text-sm text-[#1A1A1A] cursor-pointer select-none"
                >
                  {publico.nome}
                </label>
              </div>
            ))}
          </div>
          {publicosAtivos.length > 0 && (
            <button
              onClick={() => dispatch({ type: 'CLEAR_PUBLICOS' })}
              className="min-h-[44px] px-4 py-2 text-sm text-[#2D3F2D] border border-[#2D3F2D] rounded font-medium hover:bg-[#2D3F2D]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
            >
              {t.report.btnLimparFiltros}
            </button>
          )}
        </fieldset>

        {/* POUR sections — fixed order, empty sections omitted */}
        {POUR_ORDER.map((principio) => {
          const criterios = byPrinciple[principio] ?? [];
          if (criterios.length === 0) return null;
          return (
            <section key={principio} className="mb-12">
              <h2
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                className="text-2xl font-medium text-[#2D3F2D] mb-4 pb-2 border-b border-[#2D3F2D]/20"
              >
                {principio}
              </h2>
              <ul className="flex flex-col gap-4">
                {criterios.map((criterio) => (
                  <CriterioItem
                    key={criterio.id}
                    t={t}
                    criterio={criterio}
                    isImplementado={!!implementado[criterio.id]}
                    publicosAtivos={publicosAtivos}
                    onToggle={() =>
                      dispatch({ type: 'TOGGLE_IMPLEMENTADO', criterioId: criterio.id })
                    }
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

interface StatProps {
  t: Dict;
  label: string;
  value: string | number;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="border border-[#1A1A1A]/10 rounded p-4 text-center">
      <p className="text-xl font-semibold text-[#2D3F2D] leading-tight">{value}</p>
      <p className="text-xs text-[#5C5C5C] mt-1">{label}</p>
    </div>
  );
}

interface CriterioItemProps {
  t: Dict;
  criterio: Criterio;
  isImplementado: boolean;
  publicosAtivos: string[];
  onToggle: () => void;
}

function CriterioItem({ t, criterio, isImplementado, publicosAtivos, onToggle }: CriterioItemProps) {
  const destacado = deveDestacar(criterio, publicosAtivos);

  const publicoNomes = criterio.publicos_atendidos
    .map((id) => publicoNomeMap.get(id) ?? id)
    .join(', ');

  const personaDescricao =
    publicoNomes.length > 0
      ? publicoNomes
      : t.report.personaFallback;

  return (
    <li
      className={[
        'criterio rounded p-4 bg-white/60',
        // Always 4px top and left borders (layout-stable), 1px right and bottom
        'border-t-4 border-l-4 border-r border-b',
        'border-r-[#1A1A1A]/8 border-b-[#1A1A1A]/8',
        // Top border: implementado indicator
        isImplementado ? 'border-t-[#2D3F2D]' : 'border-t-transparent',
        // Left border: public highlight indicator
        destacado ? 'border-l-[#2D3F2D]' : 'border-l-transparent',
        'transition-colors duration-150',
      ].join(' ')}
    >
      {/* Header: row 1 — ID + name; row 2 — badges */}
      <div className="mb-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1 min-w-0">
          <span className="font-mono text-xs text-[#5C5C5C] shrink-0">
            {criterio.id}
          </span>
          <span className="font-semibold text-sm text-[#1A1A1A] break-words min-w-0">
            {criterio.nome}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <NivelBadge t={t} nivel={criterio.nivel} />
          <ObrigBadge obrigatoriedade={criterio.obrigatoriedade} />
          {destacado && (
            <span className="text-xs font-medium text-[#2D3F2D] break-words min-w-0">
              {t.report.relevantePara(publicoNomes)}
            </span>
          )}
        </div>
      </div>

      {/* Requirement text */}
      <p className="text-sm text-[#5C5C5C] leading-relaxed mb-2 break-words [overflow-wrap:anywhere]">
        {criterio.requisito}
      </p>

      {/* No público mapping notice */}
      {criterio.publicos_atendidos.length === 0 && (
        <p className="text-xs text-[#5C5C5C] mb-2">
          {t.report.semMapeamento}
        </p>
      )}

      {/* W3C link + implementado checkbox */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <a
          href={criterio.link_w3c}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#2D3F2D] underline underline-offset-2 break-all hover:text-[#3a5230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-1 rounded"
        >
          {t.report.linkW3C}
        </a>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`impl-${criterio.id}`}
            checked={isImplementado}
            onChange={onToggle}
            className="w-4 h-4 accent-[#2D3F2D] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-1 rounded"
          />
          <label
            htmlFor={`impl-${criterio.id}`}
            className="text-xs text-[#5C5C5C] cursor-pointer select-none"
          >
            {t.report.labelImplementado}
          </label>
        </div>
      </div>

      {/* User Story + BDD — native <details>, no ARIA custom */}
      <details className="border border-[#1A1A1A]/8 rounded overflow-hidden">
        <summary
          className="cursor-pointer px-4 py-2 text-xs font-medium text-[#2D3F2D] hover:bg-[#2D3F2D]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2D3F2D] transition-colors duration-150 select-none"
        >
          {t.report.summaryBdd}
        </summary>
        <div className="px-4 py-3 border-t border-[#1A1A1A]/8 text-sm space-y-3">
          <p className="text-xs text-[#5C5C5C] italic leading-relaxed">
            {t.bdd.introItalico}
          </p>

          <div>
            <h4 className="text-xs font-semibold text-[#5C5C5C] uppercase tracking-wide mb-1">
              {t.bdd.headingPersona}
            </h4>
            <p className="text-[#5C5C5C]">
              {t.bdd.persona(personaDescricao)}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5C5C5C] uppercase tracking-wide mb-1">
              {t.bdd.headingUserStory}
            </h4>
            <p className="text-[#5C5C5C]">
              {t.bdd.userStory(criterio.id, criterio.nome)}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5C5C5C] uppercase tracking-wide mb-1">
              {t.bdd.headingCenario}
            </h4>
            <p className="text-[#5C5C5C] leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.bdd.cenarioA(criterio.id)}<br />
              {t.bdd.cenarioB}<br />
              {t.bdd.cenarioCPre}<em>"{criterio.requisito}"</em>
            </p>
          </div>

          <p className="text-xs text-[#5C5C5C] pt-1 border-t border-[#1A1A1A]/8">
            {t.bdd.rodape}
          </p>
        </div>
      </details>
    </li>
  );
}

interface NivelBadgeProps {
  t: Dict;
  nivel: 'A' | 'AA' | 'AAA';
}

function NivelBadge({ t, nivel }: NivelBadgeProps) {
  return (
    <span className="text-xs px-1.5 py-0.5 rounded border border-[#1A1A1A]/25 text-[#5C5C5C] font-mono shrink-0">
      {t.report.nivelLabel(nivel)}
    </span>
  );
}

interface ObrigBadgeProps {
  obrigatoriedade: 'Obrigatório' | 'Recomendável';
}

function ObrigBadge({ obrigatoriedade }: ObrigBadgeProps) {
  const isObrig = obrigatoriedade === 'Obrigatório';
  return (
    <span
      className={[
        'text-xs px-1.5 py-0.5 rounded font-medium shrink-0',
        isObrig
          ? 'bg-[#1A1A1A] text-white'
          : 'border border-[#1A1A1A]/25 text-[#5C5C5C]',
      ].join(' ')}
    >
      {obrigatoriedade}
    </span>
  );
}
