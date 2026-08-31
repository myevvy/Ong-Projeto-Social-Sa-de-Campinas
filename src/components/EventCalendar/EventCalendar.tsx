import { useMemo, useState } from "react";
import "./EventCalendar.css";

export interface CalendarEvent {
  id: string | number;
  title: string;
  date: string;
  details?: string;
  meta?: string;
}

interface EventCalendarProps {
  events: CalendarEvent[];
  emptyMessage?: string;
  className?: string;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
function monthLabel(month: number, year: number) {
  return new Date(year, month, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventCalendar({
  events,
  emptyMessage = "Nenhum evento neste mês.",
  className = "",
}: EventCalendarProps) {
  const firstEventDate =
    events[0]?.date ?? new Date().toISOString().slice(0, 10);
  const firstDate = new Date(`${firstEventDate}T00:00:00`);
  const [month, setMonth] = useState(firstDate.getMonth());
  const [year, setYear] = useState(firstDate.getFullYear());
  const [expandedEvent, setExpandedEvent] = useState<string | number | null>(
    null,
  );
  const eventsByDay = useMemo(
    () => new Map(events.map((event) => [event.date, event])),
    [events],
  );
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const visibleEvents = events.filter((event) => {
    const date = new Date(`${event.date}T00:00:00`);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  function changeMonth(direction: number) {
    const next = new Date(year, month + direction, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  }

  return (
    <section
      className={`event-calendar ${className}`}
      aria-label="Calendário de eventos"
    >
      <div className="event-calendar__header">
        <div>
          <span className="event-calendar__kicker">Agenda mensal</span>
          <h3>{monthLabel(month, year)}</h3>
        </div>
        <div className="event-calendar__controls">
          <button
            type="button"
            aria-label="Mês anterior"
            onClick={() => changeMonth(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Próximo mês"
            onClick={() => changeMonth(1)}
          >
            ›
          </button>
        </div>
      </div>
      <div className="event-calendar__weekdays">
        {WEEKDAYS.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="event-calendar__days">
        {Array.from({ length: firstWeekday }, (_, index) => (
          <span className="event-calendar__blank" key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const event = eventsByDay.get(dateKey);
          return (
            <span
              className={
                event
                  ? "event-calendar__day event-calendar__day--event"
                  : "event-calendar__day"
              }
              title={event?.title}
              key={dateKey}
            >
              {day}
            </span>
          );
        })}
      </div>
      <div className="event-calendar__list">
        {visibleEvents.length === 0 && (
          <p className="event-calendar__empty">{emptyMessage}</p>
        )}
        {visibleEvents.map((event) => (
          <article
            className={`event-calendar__event ${expandedEvent === event.id ? "event-calendar__event--expanded" : ""}`}
            key={event.id}
          >
            <time dateTime={event.date}>{formatDate(event.date)}</time>
            <button
              type="button"
              className="event-calendar__event-toggle text-gold"
              onClick={() =>
                setExpandedEvent(expandedEvent === event.id ? null : event.id)
              }
              aria-expanded={expandedEvent === event.id}
            >
              <strong>{event.title}</strong>
              <span  className="text-gold [&]:!text-[#D4AF37]">
                {expandedEvent === event.id
                  ? "Ocultar detalhes"
                  : "Ver detalhes"}
              </span>
            </button>
            {expandedEvent === event.id && (
              <div className="event-calendar__event-details">
                {event.meta && <span>{event.meta}</span>}
                {event.details && <p>{event.details}</p>}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
