import { isLang, type Lang } from './index';
import { STORAGE_KEY } from '../lib/storage-key';

function readStoredLang(): Lang | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const lang = (parsed as Record<string, unknown>).lang;
    return isLang(lang) ? lang : null;
  } catch {
    return null;
  }
}

// Ordem de precedência: query param -> estado persistido -> navigator.language -> 'pt'.
export function detectLang(): Lang {
  try {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (isLang(urlLang)) return urlLang;
  } catch {
    // window/URL indisponível
  }

  const storedLang = readStoredLang();
  if (storedLang) return storedLang;

  if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
    return navigator.language.startsWith('pt') ? 'pt' : 'en';
  }

  return 'pt';
}
