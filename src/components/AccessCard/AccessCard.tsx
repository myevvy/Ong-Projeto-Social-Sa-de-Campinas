import { Tag, TagVariant } from "../Tag/Tag";
import { Button } from "../Button/Button";

export interface AccessCardProps {
  role: "volunteer" | "collaborator";
  tagLabel: string;
  title: string;
  bullets: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
}

const ROLE_CONFIG: Record<
  AccessCardProps["role"],
  { tagVariant: TagVariant; bgClass: string }
> = {
  volunteer: { tagVariant: "volunteer", bgClass: "bg-volunteer-soft" },
  collaborator: { tagVariant: "collaborator", bgClass: "bg-collaborator-soft" },
};

/**
 * Card da seção "Área de acesso". Duas variantes de cor conforme o papel
 * (voluntário = verde claro, equipe = azul claro) — nunca preto sólido,
 * ver regra de tom acolhedor no guia de design.
 */
export function AccessCard({
  role,
  tagLabel,
  title,
  bullets,
  ctaLabel = "Entrar",
  onCtaClick,
}: AccessCardProps) {
  const { tagVariant, bgClass } = ROLE_CONFIG[role];

  return (
    <article className={`flex flex-col gap-4 rounded-lg p-11 ${bgClass}`}>
      <Tag variant={tagVariant}>{tagLabel}</Tag>
      <h3 className="m-0 font-display text-2xl font-semibold text-black">
        {title}
      </h3>
      <ul className="m-0 flex flex-col gap-2.5 p-0">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-center gap-2 font-body text-[14.5px] text-ink-soft"
          >
            <span className="h-0.5 w-3 shrink-0 bg-current opacity-60" aria-hidden="true" />
            {bullet}
          </li>
        ))}
      </ul>
      <Button variant="dark" onClick={onCtaClick}>
        {ctaLabel}
      </Button>
    </article>
  );
}
