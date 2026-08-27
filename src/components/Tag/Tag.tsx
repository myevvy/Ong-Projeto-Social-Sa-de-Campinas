import type { ReactNode } from "react";

export type TagVariant = "gold" | "amber" | "volunteer" | "collaborator";

export interface TagProps {
  variant?: TagVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<TagVariant, string> = {
  gold: "bg-gold text-black",
  amber: "bg-amber text-black",
  volunteer: "bg-volunteer text-parchment",
  collaborator: "bg-collaborator text-parchment",
};

/**
 * Selo/pill pequeno em maiúsculas (fonte mono), usado em cards de evento e
 * na Área de acesso. A cor do texto já é escolhida automaticamente por
 * variante para manter contraste AA — nunca passar cor de texto manual.
 *
 * - gold / amber: categorias neutras (ex: tipo de evento)
 * - volunteer: qualquer coisa ligada a "voluntário" (verde)
 * - collaborator: qualquer coisa ligada a "equipe/colaborador" (azul)
 */
export function Tag({ variant = "gold", children }: TagProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-pill px-3 py-1.5
        font-mono text-[11px] font-semibold tracking-wide ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}
