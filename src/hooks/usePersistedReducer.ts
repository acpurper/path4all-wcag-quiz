import { useReducer, useEffect, useCallback } from 'react';
import type { State, Action } from '../types/wcag';
import { quizReducer, initialState } from '../state/quizReducer';
import { isLang } from '../i18n/index';
import { detectLang, STORAGE_KEY } from '../i18n/detectLang';
import { TOTAL_QUESTIONS } from '../lib/wcag';

const VALID_SCREENS = new Set<string>(['intro', 'quiz', 'report']);
const VALID_ANSWERS = new Set<string>(['sim', 'nao', 'nao_sei']);

function isValidState(raw: unknown): raw is State {
  if (!raw || typeof raw !== 'object') return false;
  const s = raw as Record<string, unknown>;

  if (typeof s.screen !== 'string' || !VALID_SCREENS.has(s.screen)) return false;

  if (
    !Number.isInteger(s.currentQuestionIndex) ||
    (s.currentQuestionIndex as number) < 0 ||
    (s.currentQuestionIndex as number) >= TOTAL_QUESTIONS
  ) return false;

  if (s.answers === null || typeof s.answers !== 'object') return false;
  if (
    !Object.values(s.answers as Record<string, unknown>).every(
      (v) => typeof v === 'string' && VALID_ANSWERS.has(v),
    )
  ) return false;

  if (s.implementado === null || typeof s.implementado !== 'object') return false;
  if (
    !Object.values(s.implementado as Record<string, unknown>).every(
      (v) => typeof v === 'boolean',
    )
  ) return false;

  if (!Array.isArray(s.publicosAtivos)) return false;
  if (!(s.publicosAtivos as unknown[]).every((v) => typeof v === 'string')) return false;

  if (s.startedAt !== null && typeof s.startedAt !== 'number') return false;

  if (!isLang(s.lang)) return false;

  return true;
}

function loadFromStorage(): State {
  // detectLang() resolves query param > persisted lang > navigator.language > 'pt',
  // so it always wins over whatever lang happens to be in the parsed state below —
  // a shared link's ?lang= must override a returning visitor's saved preference.
  const lang = detectLang();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...initialState, lang };
    const parsed: unknown = JSON.parse(raw);
    if (!isValidState(parsed)) return { ...initialState, lang };
    return { ...parsed, lang };
  } catch {
    return { ...initialState, lang };
  }
}

function saveToStorage(state: State): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage blocked (private mode) — app continues without persistence
  }
}

function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function usePersistedReducer(): {
  state: State;
  dispatch: (action: Action) => void;
} {
  const [state, rawDispatch] = useReducer(quizReducer, undefined, loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const dispatch = useCallback((action: Action): void => {
    if (action.type === 'RESTART') {
      clearStorage();
    }
    rawDispatch(action);
  }, []);

  return { state, dispatch };
}
