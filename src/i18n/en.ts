import type { Dict } from './pt';

export const en: Dict = {
  meta: {
    title: 'Accessibility Diagnostic — Path4All',
    description:
      'Interactive tool to specify and diagnose WCAG 2.2 accessibility requirements in digital projects, following W3C guidelines and ABNT/EN 301 549 standards.',
  },
  a11y: {
    skipLink: 'Skip to main content',
    progressoPre: 'Question ',
    progressoDe: ' of ',
    progressoLabel: (atual: number, total: number) =>
      `Progress: question ${atual} of ${total}`,
    anuncio: (n: number, total: number, pergunta: string) =>
      `Question ${n} of ${total}: ${pergunta}`,
    grupoRespostas: 'Choose an answer',
    voltarAriaLabel: 'Back to the previous question',
    seletorIdioma: 'Select language',
  },
  intro: {
    heading: 'WCAG 2.2 Accessibility Diagnostic',
    p1a: 'This tool is intended for the ',
    p1Strong: 'requirements specification phase',
    p1b: ' — not for the remediation of existing systems. Answer 13 questions about the characteristics of the system you plan to build and get a personalized checklist with the applicable WCAG 2.2 success criteria for your context.',
    p2a: 'The result follows the ',
    p2Strong: 'Path4All',
    p2b: ' method, which prioritizes criteria by user group and conformance level (A, AA, AAA).',
    btnContinue: 'Continue where you left off',
    btnRestart: 'Start over',
    btnStart: 'Start',
    footer1A: 'Tool developed by ',
    footer1Strong: 'Ana Purper',
    footer1B: ', undergraduate research fellow (PIBIC/CNPq), Escola Politécnica — PUCRS.',
    footer2A: 'Based on the ',
    footer2StrongA: 'Path4All',
    footer2B: " method, master's research by ",
    footer2StrongB: 'Renata Vinadé',
    footer2C: ', supervised by ',
    footer2StrongC: 'Prof. Dr. Sabrina Marczak',
    footer2D: '.',
  },
  quiz: {
    answerSimLabel: 'Yes',
    answerSimDesc: 'My system will have this type of content or functionality',
    answerNaoLabel: 'No',
    answerNaoDesc: 'My system will not have this type of content or functionality',
    answerNaoSeiLabel: "Don't know",
    answerNaoSeiDesc: "I'm not yet sure whether this content or functionality will be included",
    btnVoltar: 'Back',
  },
  report: {
    heading: 'Applicable WCAG 2.2 Success Criteria',
    statCategorias: 'Applicable categories',
    statObrigatorios: 'Required',
    statRecomendaveis: 'Recommended',
    statImplementados: 'Implemented (required)',
    btnExportarPdf: 'Export PDF',
    btnRefazer: 'Redo diagnostic',
    btnExpandir: 'Expand all details',
    btnRecolher: 'Collapse all details',
    fieldsetLegend: 'Filter by user group (optional)',
    fieldsetDesc:
      'Select one or more user groups to highlight especially relevant success criteria. Highlighting does not hide the other success criteria.',
    btnLimparFiltros: 'Clear filters',
    relevantePara: (nomes: string) => `Relevant to: ${nomes}`,
    semMapeamento: 'No specific user group mapping in the study.',
    linkW3C: 'View W3C documentation',
    labelImplementado: 'Implemented',
    summaryBdd: 'View as User Story + BDD',
    nivelLabel: (nivel: string) => `Level ${nivel}`,
    personaFallback: 'one or more accessibility needs',
  },
  // PENDING APPROVAL — Path4All method structure. Requires researcher review
  // before production deploy.
  bdd: {
    introItalico:
      'Initial skeleton. Adapt the persona, context, and scenario to your project before use.',
    headingPersona: 'Persona',
    persona: (descricao: string) =>
      `As a person with ${descricao}, using the system.`,
    headingUserStory: 'User Story',
    userStory: (id: string, nome: string) =>
      `As a user, I want criterion ${id} — ${nome} to be met, so that I can interact with the system without barriers.`,
    headingCenario: 'Scenario (BDD)',
    cenarioA: (id: string) =>
      `Given the system presents an element or behavior covered by ${id};`,
    cenarioB: 'When the user tries to interact with, perceive, or navigate it;',
    cenarioCPre: 'Then the system must meet the requirement: ',
    rodape:
      "Structure based on the Path4All method (Vinadé, PUCRS). Adapt it to your project's scope.",
  },
};
