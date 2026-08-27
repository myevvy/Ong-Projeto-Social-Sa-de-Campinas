import "./eventos.css";
import { EventCard } from "../../components/EventCard/EventCard";
import { EventCalendar } from "../../components/EventCalendar/EventCalendar";
import { Header } from "../../components/Header/Header";

const eventos = [
  {
    id: 1,
    title: "Atendimento de Rua",
    date: "2026-09-14",
    details:
      "Atendimento de saúde itinerante para pessoas em situação de rua com kits de higiene e escuta acolhedora.",
    meta: "Mutirão · Vila Industrial",
  },
  {
    id: 2,
    title: "Campanha de Saúde",
    date: "2026-09-21",
    details:
      "Ação de atendimento e orientação em saúde para a comunidade.",
    meta: "Campanha · Centro",
  },
];

function Eventos() {
  return (
    <>
      <Header
        logoUrl="/logo.png"
        navLinks={[
          { label: "Sobre", href: "/sobre" },
          { label: "Como ajudar", href: "/doacao" },
          { label: "Eventos", href: "/eventos" },
          { label: "Área do voluntário", href: "/voluntario" },
          { label: "Contato", href: "/contato" },
        ]}
      />

      <main className="eventos">
        <section className="eventos__intro">
          <span>AGENDA</span>
          <h1>Eventos</h1>
          <p>
            Confira nossas próximas ações e participe das iniciativas do
            Saúde Campinas.
          </p>
        </section>

        <section className="eventos__calendar">
          <EventCalendar events={eventos} />
        </section>

        <section className="eventos__cards">
          <div className="eventos__section-title">
            <span>PRÓXIMAS AÇÕES</span>
            <h2>Participe com a gente</h2>
          </div>

          <EventCard
            date="14"
            category="Mutirão"
            place="Vila Industrial"
            title="Atendimento de Rua"
            description="Atendimento de saúde itinerante para pessoas em situação de rua com kits de higiene e escuta acolhedora."
            photoUrl=""
            photoAlt=""
          />

          <EventCard
            date="21"
            category="Campanha"
            place="Centro"
            title="Campanha de Saúde"
            description="Ação de atendimento e orientação em saúde para a comunidade."
            photoUrl=""
            photoAlt=""
          />
        </section>
      </main>
    </>
  );
}

export default Eventos;