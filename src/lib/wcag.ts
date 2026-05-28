import rawData from '../../data/wcag-mapping.json';
import type { Categoria, Criterio, Publico } from '../types/wcag';

type RawData = { categorias: Categoria[]; publicos: Publico[] };

const data = rawData as unknown as RawData;

export const categorias: Categoria[] = data.categorias;
export const publicos: Publico[] = data.publicos;
export const TOTAL_QUESTIONS = categorias.length;

export function deveDestacar(criterio: Criterio, publicosAtivos: string[]): boolean {
  if (publicosAtivos.length === 0) return false;
  return criterio.publicos_atendidos.some((p) => publicosAtivos.includes(p));
}
