import { useRef, useEffect } from 'react';
import { usePersistedReducer } from './hooks/usePersistedReducer';
import { SkipLink } from './components/SkipLink';
import { LanguageToggle } from './components/LanguageToggle';
import { IntroScreen } from './screens/IntroScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ReportScreen } from './screens/ReportScreen';
import { dictionaries } from './i18n/index';

function App() {
  const { state, dispatch } = usePersistedReducer();
  const previousScreen = useRef<string | null>(null);
  const t = dictionaries[state.lang];

  useEffect(() => {
    // First run: record the current screen and exit without focusing.
    if (previousScreen.current === null) {
      previousScreen.current = state.screen;
      return;
    }
    // StrictMode rerun or re-execution with the same screen — do nothing.
    if (previousScreen.current === state.screen) {
      return;
    }
    // Real screen transition: focus the new screen's h1.
    previousScreen.current = state.screen;
    const h1 = document.querySelector('main h1') as HTMLHeadingElement | null;
    if (h1) {
      h1.focus();
    }
  }, [state.screen]);

  useEffect(() => {
    document.title = t.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t.meta.description);
  }, [t]);

  // Critério 3.1.1 — o idioma do documento precisa refletir o idioma da UI.
  useEffect(() => {
    document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';
  }, [state.lang]);

  // Mantém o idioma no link (?lang=), sem poluir o histórico do botão voltar.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', state.lang);
    window.history.replaceState({}, '', url);
  }, [state.lang]);

  return (
    <>
      <SkipLink t={t} />
      <header className="flex justify-end px-6 py-3">
        <LanguageToggle t={t} lang={state.lang} dispatch={dispatch} />
      </header>
      <main id="main" className="bg-[#FAFAF7] text-[#1A1A1A]">
        {state.screen === 'intro' && (
          <IntroScreen state={state} dispatch={dispatch} t={t} />
        )}
        {state.screen === 'quiz' && (
          <QuizScreen state={state} dispatch={dispatch} t={t} />
        )}
        {state.screen === 'report' && (
          <ReportScreen state={state} dispatch={dispatch} t={t} />
        )}
      </main>
    </>
  );
}

export default App;
