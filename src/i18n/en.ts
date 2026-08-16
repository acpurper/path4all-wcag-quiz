import type { Dict } from './pt';

export const en: Dict = {
  meta: {
    title: 'Diagnóstico de Acessibilidade — Path4All',
    description:
      'Ferramenta interativa para especificar e diagnosticar requisitos de acessibilidade WCAG 2.2 em projetos digitais, seguindo as diretrizes do W3C e normas ABNT/EN 301 549.',
  },
  a11y: {
    skipLink: 'Pular para o conteúdo principal',
    progressoPre: 'Pergunta ',
    progressoDe: ' de ',
    progressoLabel: (atual: number, total: number) =>
      `Progresso: pergunta ${atual} de ${total}`,
    anuncio: (n: number, total: number, pergunta: string) =>
      `Pergunta ${n} de ${total}: ${pergunta}`,
    grupoRespostas: 'Escolha uma resposta',
    voltarAriaLabel: 'Voltar para a pergunta anterior',
    seletorIdioma: 'Selecionar idioma',
  },
  intro: {
    heading: 'Diagnóstico de Acessibilidade WCAG 2.2',
    p1a: 'Esta ferramenta é destinada à ',
    p1Strong: 'fase de especificação de requisitos',
    p1b: ' — não à remediação de sistemas existentes. Responda 13 perguntas sobre as características do sistema que você planeja construir e receba um checklist personalizado com os critérios WCAG 2.2 aplicáveis ao seu contexto.',
    p2a: 'O resultado segue o método ',
    p2Strong: 'Path4All',
    p2b: ', que prioriza critérios por público-alvo e nível de conformidade (A, AA, AAA).',
    btnContinue: 'Continuar de onde parou',
    btnRestart: 'Começar do início',
    btnStart: 'Começar',
    footerA: 'Pesquisa de doutorado de ',
    footerStrongA: 'Renata Vinadé',
    footerB: ', PUCRS, orientação ',
    footerStrongB: 'Profa. Dra. Sabrina Marczak',
    footerC: '. Apoio Bolsa Renata Vinadé.',
  },
  quiz: {
    answerSimLabel: 'Sim',
    answerSimDesc: 'Meu sistema terá esse tipo de conteúdo ou funcionalidade',
    answerNaoLabel: 'Não',
    answerNaoDesc: 'Meu sistema não terá esse tipo de conteúdo ou funcionalidade',
    answerNaoSeiLabel: 'Não sei',
    answerNaoSeiDesc: 'Ainda não tenho certeza se haverá esse conteúdo ou funcionalidade',
    btnVoltar: 'Voltar',
  },
  report: {
    heading: 'Relatório de critérios WCAG 2.2 aplicáveis',
    statCategorias: 'Categorias aplicáveis',
    statObrigatorios: 'Obrigatórios',
    statRecomendaveis: 'Recomendáveis',
    statImplementados: 'Obrigatórios implementados',
    btnExportarPdf: 'Exportar PDF',
    btnRefazer: 'Refazer diagnóstico',
    btnExpandir: 'Expandir todos os detalhes',
    btnRecolher: 'Recolher todos os detalhes',
    fieldsetLegend: 'Filtrar por público-alvo (opcional)',
    fieldsetDesc:
      'Selecione um ou mais públicos para destacar critérios especialmente relevantes. O destaque não esconde os demais critérios.',
    btnLimparFiltros: 'Limpar filtros',
    relevantePara: (nomes: string) => `Relevante para: ${nomes}`,
    semMapeamento: 'Sem mapeamento específico de público no estudo.',
    linkW3C: 'Ver documentação W3C',
    labelImplementado: 'Implementado',
    summaryBdd: 'Ver como User Story + BDD',
    nivelLabel: (nivel: string) => `Nível ${nivel}`,
    personaFallback: 'uma ou mais necessidades de acessibilidade',
  },
  bdd: {
    introItalico:
      'Esqueleto inicial. Adapte a persona, contexto e cenário ao seu projeto antes de usar.',
    headingPersona: 'Persona',
    persona: (descricao: string) =>
      `Como pessoa com ${descricao}, usando o sistema.`,
    headingUserStory: 'User Story',
    userStory: (id: string, nome: string) =>
      `Eu quero que o critério ${id} — ${nome} seja atendido, para que eu possa interagir com o sistema sem barreiras.`,
    headingCenario: 'Cenário (BDD)',
    cenarioA: (id: string) =>
      `Dado que o sistema apresenta um elemento ou comportamento abrangido por ${id};`,
    cenarioB: 'Quando o usuário tentar interagir, perceber ou navegar por ele;',
    cenarioCPre: 'Então o sistema deve atender ao requisito: ',
    rodape:
      'Estrutura baseada no método Path4All (Vinadé, PUCRS). Adapte ao escopo do seu projeto.',
  },
};
