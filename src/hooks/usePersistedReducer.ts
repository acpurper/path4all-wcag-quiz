import { useReducer, useEffect, useCallback } from 'react';
import type { State, Action } from '../types/wcag';
import { quizReducer, initialState } from '../state/quizReducer';

const STORAGE_KEY = 'wcag-quiz-state-v2';

function isValidState(raw: unknown): raw is State {
  if (!raw || typeof raw !== 'object') return false;
  const s = raw as Record<string, unknown>;
  return (
    typeof s.screen === 'string' &&
    typeof s.currentQuestionIndex === 'number' &&
    s.answers !== null && typeof s.answers === 'object' &&
    s.implementado !== null && typeof s.implementado === 'object' &&
    Array.isArray(s.publicosAtivos)
  );
}

function loadFromStorage(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidState(parsed)) return initialState;
    return parsed;
  } catch {
    return initialState;
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
