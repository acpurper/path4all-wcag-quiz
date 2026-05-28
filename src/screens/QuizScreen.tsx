import { useEffect, useRef, useState } from 'react';
import type { State, Answer } from '../types/wcag';
import { categorias, TOTAL_QUESTIONS } from '../lib/wcag';
import { ProgressBar } from '../components/ProgressBar';

interface Props {
  state: State;
  dispatch: (action: import('../types/wcag').Action) => void;
}

export function QuizScreen({ state, dispatch }: Props) {
  const { currentQuestionIndex, answers } = state;
  const categoria = categorias[currentQuestionIndex];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);
  const [announcement, setAnnouncement] = useState('');
  const lastAnnouncedIndex = useRef<number | null>(null);

  // Focus heading on question change only — skip initial mount so Tab order
  // starts at SkipLink and screen readers announce the page normally.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [currentQuestionIndex]);

  // Announce question change to screen readers (skip on first render)
  useEffect(() => {
    if (
      lastAnnouncedIndex.current !== null &&
      lastAnnouncedIndex.current !== currentQuestionIndex
    ) {
      setAnnouncement(
        `Pergunta ${currentQuestionIndex + 1} de ${TOTAL_QUESTIONS}: ${categoria.pergunta}`,
      );
    }
    lastAnnouncedIndex.current = currentQuestionIndex;
  }, [currentQuestionIndex, categoria.pergunta]);

  // Esc key: BACK — scoped to QuizScreen mount lifetime only
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        dispatch({ type: 'BACK' });
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  function handleAnswer(answer: Answer) {
    dispatch({ type: 'ANSWER', categoryId: categoria.id, answer });
  }

  function handleBack() {
    dispatch({ type: 'BACK' });
  }

  const currentAnswer = answers[categoria.id];
  const displayNumber = currentQuestionIndex + 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Visually hidden aria-live region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <ProgressBar current={displayNumber} total={TOTAL_QUESTIONS} />
        </div>

        <p className="text-sm font-medium text-[#2D3F2D] uppercase tracking-wide mb-2">
          {categoria.nome}
        </p>

        <h1
          ref={headingRef}
          tabIndex={-1}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          className="text-3xl sm:text-4xl font-medium text-[#1A1A1A] mb-10 leading-tight"
        >
          {categoria.pergunta}
        </h1>

        <div
          role="group"
          aria-label="Escolha uma resposta"
          className="flex flex-col gap-3 mb-10"
        >
          <AnswerButton
            label="Sim"
            description="Meu sistema terá esse tipo de conteúdo ou funcionalidade"
            value="sim"
            currentAnswer={currentAnswer}
            onClick={() => handleAnswer('sim')}
          />
          <AnswerButton
            label="Não"
            description="Meu sistema não terá esse tipo de conteúdo ou funcionalidade"
            value="nao"
            currentAnswer={currentAnswer}
            onClick={() => handleAnswer('nao')}
          />
          <AnswerButton
            label="Não sei"
            description="Ainda não tenho certeza se haverá esse conteúdo ou funcionalidade"
            value="nao_sei"
            currentAnswer={currentAnswer}
            onClick={() => handleAnswer('nao_sei')}
          />
        </div>

        {currentQuestionIndex > 0 && (
          <button
            onClick={handleBack}
            className="min-h-[44px] px-6 py-2 text-[#2D3F2D] text-sm font-medium rounded border border-[#2D3F2D]/30 hover:border-[#2D3F2D] hover:bg-[#2D3F2D]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2 transition-colors duration-150 flex items-center gap-2"
            aria-label="Voltar para a pergunta anterior"
          >
            <span aria-hidden="true">←</span> Voltar
          </button>
        )}
      </div>
    </div>
  );
}

interface AnswerButtonProps {
  label: string;
  description: string;
  value: Answer;
  currentAnswer: Answer | undefined;
  onClick: () => void;
}

function AnswerButton({ label, description, value, currentAnswer, onClick }: AnswerButtonProps) {
  const isSelected = currentAnswer === value;

  return (
    <button
      onClick={onClick}
      className={[
        'min-h-[44px] w-full text-left px-5 py-4 rounded border-2 transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D3F2D] focus-visible:ring-offset-2',
        isSelected
          ? 'border-[#2D3F2D] bg-[#2D3F2D]/8 text-[#2D3F2D]'
          : 'border-[#1A1A1A]/15 text-[#1A1A1A] hover:border-[#2D3F2D]/50 hover:bg-[#2D3F2D]/4',
      ].join(' ')}
    >
      <span className="flex items-center gap-2">
        {/* Non-color selection indicator: ✓ marker + font weight */}
        <span
          aria-hidden="true"
          className={[
            'inline-flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 text-xs font-bold transition-colors duration-150',
            isSelected
              ? 'border-[#2D3F2D] bg-[#2D3F2D] text-white'
              : 'border-[#1A1A1A]/25 text-transparent',
          ].join(' ')}
        >
          ✓
        </span>
        <span className="font-semibold text-base">{label}</span>
      </span>
      <span className="block text-sm mt-1 ml-7 text-[#5C5C5C]">{description}</span>
    </button>
  );
}
