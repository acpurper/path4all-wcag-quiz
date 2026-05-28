interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <p className="text-sm text-[#1A1A1A] mb-2" aria-hidden="true">
        Pergunta <strong>{current}</strong> de {total}
      </p>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Progresso: pergunta ${current} de ${total}`}
        className="h-2 w-full rounded-full bg-[#1A1A1A]/10 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-[#2D3F2D] transition-[width] duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
