import type { Dict, Lang } from '../i18n/index';
import type { Action } from '../types/wcag';

interface Props {
  t: Dict;
  lang: Lang;
  dispatch: (action: Action) => void;
}

export function LanguageToggle({ t, lang, dispatch }: Props) {
  function setLang(next: Lang) {
    // Não move foco: o botão clicado permanece focado.
    dispatch({ type: 'SET_LANG', lang: next });
  }

  return (
    <div role="group" aria-label={t.a11y.seletorIdioma} className="flex gap-2">
      <LangButton
        lang="pt-BR"
        label="Português"
        isActive={lang === 'pt'}
        onClick={() => setLang('pt')}
      />
      <LangButton
        lang="en"
        label="English"
        isActive={lang === 'en'}
        onClick={() => setLang('en')}
      />
    </div>
  );
}

interface LangButtonProps {
  lang: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function LangButton({ lang, label, isActive, onClick }: LangButtonProps) {
  return (
    <button
      type="button"
      lang={lang}
      aria-pressed={isActive}
      onClick={onClick}
      className={[
        'min-w-[24px] min-h-[24px] px-3 py-1.5 rounded text-sm transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2',
        isActive
          ? 'border-2 border-[#2D3F2D] font-semibold text-[#2D3F2D] bg-[#2D3F2D]/8'
          : 'border-2 border-transparent font-normal text-[#1A1A1A] hover:border-[#2D3F2D]/30',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
