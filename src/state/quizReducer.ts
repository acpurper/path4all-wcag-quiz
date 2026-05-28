import type { State, Action } from '../types/wcag';
import { categorias, TOTAL_QUESTIONS } from '../lib/wcag';

export const initialState: State = {
  screen: 'intro',
  currentQuestionIndex: 0,
  answers: {},
  implementado: {},
  publicosAtivos: [],
  startedAt: null,
};

export function quizReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_NEW':
      return {
        ...initialState,
        screen: 'quiz',
        startedAt: Date.now(),
      };

    case 'CONTINUE':
      return {
        ...state,
        screen: 'quiz',
        currentQuestionIndex: action.resumeIndex,
      };

    case 'ANSWER': {
      const newAnswers = { ...state.answers, [action.categoryId]: action.answer };
      const isLast = state.currentQuestionIndex === TOTAL_QUESTIONS - 1;
      return {
        ...state,
        answers: newAnswers,
        currentQuestionIndex: isLast
          ? state.currentQuestionIndex
          : state.currentQuestionIndex + 1,
        screen: isLast ? 'report' : 'quiz',
        startedAt: state.startedAt ?? Date.now(),
      };
    }

    case 'BACK':
      if (state.currentQuestionIndex === 0) {
        return { ...state, screen: 'intro' };
      }
      return { ...state, currentQuestionIndex: state.currentQuestionIndex - 1 };

    case 'FINISH':
      return { ...state, screen: 'report' };

    case 'TOGGLE_IMPLEMENTADO':
      return {
        ...state,
        implementado: {
          ...state.implementado,
          [action.criterioId]: !state.implementado[action.criterioId],
        },
      };

    case 'TOGGLE_PUBLICO': {
      const isActive = state.publicosAtivos.includes(action.publicoId);
      return {
        ...state,
        publicosAtivos: isActive
          ? state.publicosAtivos.filter((p) => p !== action.publicoId)
          : [...state.publicosAtivos, action.publicoId],
      };
    }

    case 'CLEAR_PUBLICOS':
      return { ...state, publicosAtivos: [] };

    case 'RESTART':
      return { ...initialState };

    default:
      return state;
  }
}

export function getResumeIndex(answers: State['answers']): number {
  const firstUnanswered = categorias.findIndex((cat) => !(cat.id in answers));
  return firstUnanswered === -1 ? 0 : firstUnanswered;
}
