import { useState } from "react";

export interface FaqItemProps {
  question: string;
  answer: string;
  /** Se true, começa aberto (usado no primeiro item da lista) */
  defaultOpen?: boolean;
}

/**
 * Item de acordeão da seção de Perguntas frequentes.
 * Cada FaqItem controla seu próprio estado — não precisa de lógica externa.
 */
export function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-sm bg-black px-7 py-[22px]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-5 bg-transparent p-0 text-left"
      >
        <span className="font-body text-[15.5px] font-bold text-white">
          {question}
        </span>
        <span className="shrink-0 font-mono text-lg font-semibold text-gold" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      {open && (
        <p className="m-0 mt-3.5 font-body text-sm leading-relaxed text-[#e6e0d4]">
          {answer}
        </p>
      )}
    </div>
  );
}
