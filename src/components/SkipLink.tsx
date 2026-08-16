import type { Dict } from '../i18n/index';

interface Props {
  t: Dict;
}

export function SkipLink({ t }: Props) {
  return (
    <a href="#main" className="skip-link">
      {t.a11y.skipLink}
    </a>
  );
}
