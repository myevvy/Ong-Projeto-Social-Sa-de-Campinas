import { DatePill } from "../DatePill/DatePill";
import { Button } from "../Button/Button";

export interface EventCardProps {
  date: string;
  /** Ex: "MUTIRÃO", "CAMPANHA", "CAPACITAÇÃO" */
  category: string;
  place: string;
  title: string;
  description: string;
  photoUrl: string;
  photoAlt: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

/**
 * Card usado tanto na seção "Próximos eventos" da home quanto na página
 * de Agenda completa. Fundo preto quente, foto no topo, botão dourado.
 */
export function EventCard({
  date,
  category,
  place,
  title,
  description,
  photoUrl,
  photoAlt,
  ctaLabel = "Quero participar",
  onCtaClick,
}: EventCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg bg-black p-[22px]">
      <img
        src={photoUrl}
        alt={photoAlt}
        className="aspect-[300/220] w-full rounded-sm object-cover"
      />
      <div className="flex items-center gap-2.5">
        <DatePill label={date} />
        <span className="font-mono text-[10.5px] font-medium uppercase tracking-wide text-gold">
          {category} · {place}
        </span>
      </div>
      <h3 className="m-0 font-display text-xl font-normal text-parchment">
        {title}
      </h3>
      <p className="m-0 font-body text-sm leading-snug text-[#c8c8c3]">
        {description}
      </p>
      <Button variant="primary" onClick={onCtaClick}>
        {ctaLabel}
      </Button>
    </article>
  );
}
