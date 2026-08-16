import { pt } from './pt';
import { en } from './en';
export type { Dict } from './pt';
export const LANGS = ['pt', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const dictionaries = { pt, en };
export const isLang = (v: unknown): v is Lang =>
  typeof v === 'string' && (LANGS as readonly string[]).includes(v);
