import { ReactNode } from "react";

export interface ValueCardProps {
  /** Ícone já colorido (SVG/component) — ex: de lucide-react */
  icon: ReactNode;
  title: string;
  description: string;
}

/**
 * Card usado na seção "Sobre" (Humanização, Respeito, Altruísmo) e em
 * qualquer outra grade de 3 itens com ícone + título + descrição curta.
 */
export function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <article className="flex flex-col items-center gap-2 rounded-md border border-black/10 bg-white p-6 text-center">
      <span className="mb-1 text-[34px] leading-none text-gold">{icon}</span>
      <h3 className="m-0 font-display text-[17px] font-semibold text-black">
        {title}
      </h3>
      <p className="m-0 font-body text-[13.5px] text-ink-soft">{description}</p>
    </article>
  );
}
