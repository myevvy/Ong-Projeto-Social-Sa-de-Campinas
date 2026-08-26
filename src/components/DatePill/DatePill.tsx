export interface DatePillProps {
  /** Ex: "14", "14 SET" — o formato varia conforme o card que usa */
  label: string;
}

/**
 * Selo redondo com a data, usado dentro dos cards de evento/agenda.
 * Sempre fundo preto quente + texto claro, para contrastar com a foto atrás.
 */
export function DatePill({ label }: DatePillProps) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-pill bg-black px-3 py-1.5 font-mono text-xs font-semibold text-parchment">
      {label}
    </span>
  );
}
