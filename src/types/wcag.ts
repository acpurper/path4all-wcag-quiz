// IDs de categoria, critério e público são chaves opacas de dados — nunca texto
// de interface, nunca candidatos a tradução e nunca regerados a partir de nomes.
import type { Lang } from '../i18n/index';

export interface Criterio {
  id: string;
  nome: string;
  nivel: 'A' | 'AA' | 'AAA';
  obrigatoriedade: 'Obrigatório' | 'Recomendável';
  requisito: string;
  link_w3c: string;
  publicos_atendidos: string[];
}

export interface Categoria {
  id: string;
  nome: string;
  principio: string;
  pergunta: string;
  criterios: Criterio[];
}

export interface Publico {
  id: string;
  nome: string;
}

export type Answer = 'sim' | 'nao' | 'nao_sei';
export type Screen = 'intro' | 'quiz' | 'report';

export interface State {
  screen: Screen;
  currentQuestionIndex: number;
  answers: Record<string, Answer>;
  implementado: Record<string, boolean>;
  publicosAtivos: string[];
  startedAt: number | null;
  lang: Lang;
}

export type Action =
  | { type: 'START_NEW' }
  | { type: 'CONTINUE'; resumeIndex: number }
  | { type: 'ANSWER'; categoryId: string; answer: Answer }
  | { type: 'BACK' }
  | { type: 'FINISH' }
  | { type: 'RESTART' }
  | { type: 'TOGGLE_IMPLEMENTADO'; criterioId: string }
  | { type: 'TOGGLE_PUBLICO'; publicoId: string }
  | { type: 'CLEAR_PUBLICOS' }
  | { type: 'SET_LANG'; lang: Lang };
