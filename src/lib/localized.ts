import type { Lang } from '../i18n';
import type { Localized } from '../types/wcag';

export function loc<T extends string>(
  value: Localized & { pt: T; en: T },
  lang: Lang,
): T {
  return value[lang];
}
