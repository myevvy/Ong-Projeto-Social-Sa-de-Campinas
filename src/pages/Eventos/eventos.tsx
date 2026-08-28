import { useMemo, useState } from "react";
import "./eventos.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Kicker } from "../../components/Kicker/Kicker";
import { Button } from "../../components/Button/Button";
import { EventCard } from "../../components/EventCard/EventCard";
import heroPlaceholder from "../../assets/hero.png";

type Categoria = "Mutirão" | "Campanha" | "Capacitação";

interface Evento {
  id: number;
  date: string; // ISO, ex: "2026-09-14"
  category: Categoria;
  place: string;
  title: string;
  description: string;
  photoUrl: string;
  photoAlt: string;
}

const EVENTOS: Evento[] = [
  {
    id: 1,
    date: "2026-09-14",
    category: "Mutirão",
    place: "Vila Industrial",
    title: "Atendimento de rua",
    description:
      "Atendimento de saúde itinerante para pessoas em situação de rua, com kits de higiene e escuta acolhedora.",
    photoUrl: heroPlaceholder,
    photoAlt: "Voluntária atendendo uma pessoa em situação de rua",
  },
  {
    id: 2,
    date: "2026-09-21",
    category: "Campanha",
    place: "Ponto de coleta",
    title: "Coleta de medicamentos",
    description:
      "Recolhemos remédios e amostras grátis parados no armário para reforçar o estoque das próximas ações.",
    photoUrl: heroPlaceholder,
    photoAlt: "Voluntários organizando doações de medicamentos",
  },
  {
    id: 3,
    date: "2026-09-28",
    category: "Mutirão",
    place: "Centro",
    title: "Atendimento de rua",
    description:
      "Segunda rodada do mês, com apoio de novos voluntários da capacitação de setembro.",
    photoUrl: heroPlaceholder,
    photoAlt: "Atendimento de rua no centro da cidade",
  },
  {
    id: 4,
    date: "2026-10-05",
    category: "Capacitação",
    place: "Sede parceira",
    title: "Roda de novos voluntários",
    description:
      "Encontro para quem está começando: rotina das ações, uso do estoque colaborativo e primeiros passos.",
    photoUrl: heroPlaceholder,
    photoAlt: "Roda de conversa com novos voluntários",
  },
  {
    id: 5,
    date: "2026-10-12",
    category: "Mutirão",
    place: "Vila Industrial",
    title: "Atendimento de rua",
    description: "Atendimento mensal fixo na região, com parceria da UBS local.",
    photoUrl: heroPlaceholder,
    photoAlt: "Atendimento de saúde itinerante",
  },
  {
    id: 6,
    date: "2026-10-19",
    category: "Campanha",
    place: "Toda a cidade",
    title: "Arrecadação de agasalhos",
    description:
      "Início da campanha de inverno, aceitando doações de roupas e cobertores.",
    photoUrl: heroPlaceholder,
    photoAlt: "Caixas de doação de roupas de frio",
  },
  {
    id: 7,
    date: "2026-11-09",
    category: "Mutirão",
    place: "Vila Industrial",
    title: "Atendimento de rua",
    description:
      "Atendimento mensal fixo na região, com kits de higiene e orientação de saúde.",
    photoUrl: heroPlaceholder,
    photoAlt: "Atendimento de rua com kits de higiene",
  },
  {
    id: 8,
    date: "2026-11-16",
    category: "Capacitação",
    place: "Sede parceira",
    title: "Primeiros socorros na rua",
    description:
      "Oficina prática voltada para voluntários que atuam no atendimento itinerante.",
    photoUrl: heroPlaceholder,
    photoAlt: "Oficina de primeiros socorros",
  },
];

const FILTROS: Array<"Todos" | Categoria> = [
  "Todos",
  "Mutirão",
  "Campanha",
  "Capacitação",
];

const MESES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

function formatDay(iso: string) {
  return iso.split("-")[2];
}

function formatMesAno(iso: string) {
  const [ano, mes] = iso.split("-");
  return `${MESES[Number(mes) - 1]} ${ano}`;
}

function Eventos() {
  const [filtro, setFiltro] = useState<"Todos" | Categoria>("Todos");

  const eventosFiltrados = useMemo(
    () =>
      filtro === "Todos"
        ? EVENTOS
        : EVENTOS.filter((evento) => evento.category === filtro),
    [filtro],
  );

  const grupos = useMemo(() => {
    const mapa = new Map<string, Evento[]>();
    for (const evento of eventosFiltrados) {
      const chave = formatMesAno(evento.date);
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave)!.push(evento);
    }
    return Array.from(mapa.entries());
  }, [eventosFiltrados]);

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
        <a href="/" className="eventos__back">
          ← Voltar para o início
        </a>

        <section className="eventos__intro">
          <Kicker color="amber">Agenda completa</Kicker>
          <h1 className="eventos__title">Todas as próximas ações.</h1>
          <p className="eventos__lead">
            Cada ação aqui embaixo é uma chance de ajudar de perto. Confira as
            datas, os locais e escolha onde encaixar sua agenda.
          </p>
        </section>

        <div className="eventos__filters">
          {FILTROS.map((label) => (
            <Button
              key={label}
              variant={filtro === label ? "dark" : "outline"}
              onClick={() => setFiltro(label)}
              className="px-4 py-2 text-[13px]"
            >
              {label}
            </Button>
          ))}
        </div>

        {grupos.map(([mesAno, eventosDoMes]) => (
          <section key={mesAno} className="eventos__grupo">
            <p className="eventos__mes">{mesAno}</p>
            <div className="eventos__cards">
              {eventosDoMes.map((evento) => (
                <EventCard
                  key={evento.id}
                  date={formatDay(evento.date)}
                  category={evento.category}
                  place={evento.place}
                  title={evento.title}
                  description={evento.description}
                  photoUrl={evento.photoUrl}
                  photoAlt={evento.photoAlt}
                />
              ))}
            </div>
          </section>
        ))}

        {grupos.length === 0 && (
          <p className="eventos__vazio">
            Nenhuma ação encontrada para esse filtro no momento.
          </p>
        )}
      </main>

      <Footer
        navLinks={[
          { label: "Sobre", href: "/sobre" },
          { label: "Como ajudar", href: "/doacao" },
          { label: "Eventos", href: "/eventos" },
          { label: "Área do voluntário", href: "/voluntario" },
          { label: "Contato", href: "/contato" },
        ]}
        email="contato@saudecampinas.org"
        whatsappLabel="(19) 99999-9999"
        instagramHandle="@saudecampinas"
        location="Campinas, SP"
      />
    </>
  );
}

export default Eventos;
