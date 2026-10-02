import type { State } from '../types/wcag';
import type { Dict } from '../i18n/index';
import { getResumeIndex } from '../state/quizReducer';

interface Props {
  t: Dict;
  state: State;
  dispatch: (action: import('../types/wcag').Action) => void;
}

export function IntroScreen({ t, state, dispatch }: Props) {
  const hasAnswers = Object.keys(state.answers).length > 0;

  function handleContinue() {
    dispatch({ type: 'CONTINUE', resumeIndex: getResumeIndex(state.answers) });
  }

  function handleStart() {
    dispatch({ type: 'START_NEW' });
  }

  function handleRestart() {
    dispatch({ type: 'RESTART' });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full">
        <h1
          tabIndex={-1}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          className="text-4xl sm:text-5xl font-medium text-[#2D3F2D] mb-6 leading-tight"
        >
          {t.intro.heading}
        </h1>

        <p className="text-base sm:text-lg text-[#1A1A1A] mb-4 leading-relaxed">
          {t.intro.p1a}<strong>{t.intro.p1Strong}</strong>{t.intro.p1b}
        </p>

        <p className="text-base sm:text-lg text-[#1A1A1A] mb-10 leading-relaxed">
          {t.intro.p2a}<strong>{t.intro.p2Strong}</strong>{t.intro.p2b}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {hasAnswers ? (
            <>
              <button
                onClick={handleContinue}
                className="min-h-[44px] px-8 py-3 bg-[#2D3F2D] text-white rounded text-base font-medium hover:bg-[#3a5230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
              >
                {t.intro.btnContinue}
              </button>
              <button
                onClick={handleRestart}
                className="min-h-[44px] px-8 py-3 border-2 border-[#2D3F2D] text-[#2D3F2D] rounded text-base font-medium hover:bg-[#2D3F2D]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
              >
                {t.intro.btnRestart}
              </button>
            </>
          ) : (
            <button
              onClick={handleStart}
              className="min-h-[44px] px-8 py-3 bg-[#2D3F2D] text-white rounded text-base font-medium hover:bg-[#3a5230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
            >
              {t.intro.btnStart}
            </button>
          )}
        </div>

        <footer className="border-t border-[#1A1A1A]/10 pt-6 space-y-1">
          <p className="text-sm text-[#5C5C5C] leading-relaxed">
            {t.intro.footer1A}
            <strong className="text-[#5C5C5C]">{t.intro.footer1Strong}</strong>
            {t.intro.footer1B}
          </p>
          <p className="text-sm text-[#5C5C5C] leading-relaxed">
            {t.intro.footer2A}
            <strong className="text-[#5C5C5C]">{t.intro.footer2StrongA}</strong>
            {t.intro.footer2B}
            <strong className="text-[#5C5C5C]">{t.intro.footer2StrongB}</strong>
            {t.intro.footer2C}
            <strong className="text-[#5C5C5C]">{t.intro.footer2StrongC}</strong>
            {t.intro.footer2D}
          </p>
        </footer>
      </div>
    </div>
  );
}
