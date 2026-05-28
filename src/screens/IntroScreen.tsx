import type { State } from '../types/wcag';
import { getResumeIndex } from '../state/quizReducer';

interface Props {
  state: State;
  dispatch: (action: import('../types/wcag').Action) => void;
}

export function IntroScreen({ state, dispatch }: Props) {
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
          Diagnóstico de Acessibilidade WCAG 2.2
        </h1>

        <p className="text-base sm:text-lg text-[#1A1A1A] mb-4 leading-relaxed">
          Esta ferramenta é destinada à <strong>fase de especificação de
          requisitos</strong> — não à remediação de sistemas existentes.
          Responda 13 perguntas sobre as características do sistema que
          você planeja construir e receba um checklist personalizado com
          os critérios WCAG 2.2 aplicáveis ao seu contexto.
        </p>

        <p className="text-base sm:text-lg text-[#1A1A1A] mb-10 leading-relaxed">
          O resultado segue o método <strong>Path4All</strong>, que prioriza
          critérios por público-alvo e nível de conformidade (A, AA, AAA).
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {hasAnswers ? (
            <>
              <button
                onClick={handleContinue}
                className="min-h-[44px] px-8 py-3 bg-[#2D3F2D] text-white rounded text-base font-medium hover:bg-[#3a5230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
              >
                Continuar de onde parou
              </button>
              <button
                onClick={handleRestart}
                className="min-h-[44px] px-8 py-3 border-2 border-[#2D3F2D] text-[#2D3F2D] rounded text-base font-medium hover:bg-[#2D3F2D]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
              >
                Começar do início
              </button>
            </>
          ) : (
            <button
              onClick={handleStart}
              className="min-h-[44px] px-8 py-3 bg-[#2D3F2D] text-white rounded text-base font-medium hover:bg-[#3a5230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150"
            >
              Começar
            </button>
          )}
        </div>

        <footer className="border-t border-[#1A1A1A]/10 pt-6">
          <p className="text-sm text-[#5C5C5C] leading-relaxed">
            Pesquisa de doutorado de{' '}
            <strong className="text-[#5C5C5C]">Renata Vinadé</strong>,
            PUCRS, orientação{' '}
            <strong className="text-[#5C5C5C]">
              Profa. Dra. Sabrina Marczak
            </strong>
            . Apoio Bolsa Renata Vinadé.
          </p>
        </footer>
      </div>
    </div>
  );
}
