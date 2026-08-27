import type { ReactNode } from "react";

export interface KickerProps {
  children: ReactNode;
  color?: "gold" | "amber";
}

const COLOR_CLASSES: Record<NonNullable<KickerProps["color"]>, string> = {
  gold: "text-gold",
  amber: "text-amber",
};

/**
 * Rótulo pequeno em caixa alta (fonte mono) usado no topo de toda seção
 * do site — ex: "PRÓXIMOS EVENTOS", "DOAÇÃO", "SIGA DE PERTO".
 */
export function Kicker({ children, color = "gold" }: KickerProps) {
  return (
    <p
      className={`m-0 font-mono text-[13px] font-semibold uppercase tracking-[1.4px] ${COLOR_CLASSES[color]}`}
    >
      {children}
    </p>
  );
}
